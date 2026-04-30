#!/usr/bin/env swift

import AVFoundation
import CoreGraphics
import Foundation
import ImageIO

struct Options {
    var framesDir: URL?
    var output: URL?
    var fps: Int32 = 24
    var width: Int = 1920
    var height: Int = 1080
}

func parseOptions() throws -> Options {
    var options = Options()
    var index = 1
    let args = CommandLine.arguments

    while index < args.count {
        let key = args[index]
        let value = index + 1 < args.count ? args[index + 1] : nil

        switch key {
        case "--frames":
            guard let value else { throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Missing value for --frames"]) }
            options.framesDir = URL(fileURLWithPath: value)
            index += 2
        case "--out":
            guard let value else { throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Missing value for --out"]) }
            options.output = URL(fileURLWithPath: value)
            index += 2
        case "--fps":
            guard let value, let fps = Int32(value), fps > 0 else { throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "--fps must be a positive integer"]) }
            options.fps = fps
            index += 2
        case "--width":
            guard let value, let width = Int(value), width > 0 else { throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "--width must be a positive integer"]) }
            options.width = width
            index += 2
        case "--height":
            guard let value, let height = Int(value), height > 0 else { throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "--height must be a positive integer"]) }
            options.height = height
            index += 2
        default:
            throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Unknown argument \(key)"])
        }
    }

    guard options.framesDir != nil else {
        throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Missing --frames directory"])
    }
    guard options.output != nil else {
        throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Missing --out MP4 path"])
    }

    return options
}

func pngFrames(in directory: URL) throws -> [URL] {
    let files = try FileManager.default.contentsOfDirectory(at: directory, includingPropertiesForKeys: nil)
    let frames = files
        .filter { $0.pathExtension.lowercased() == "png" }
        .sorted { $0.lastPathComponent.localizedStandardCompare($1.lastPathComponent) == .orderedAscending }

    guard !frames.isEmpty else {
        throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "No PNG frames found in \(directory.path)"])
    }

    return frames
}

func loadCGImage(_ url: URL) throws -> CGImage {
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not read image \(url.path)"])
    }
    return image
}

func makePixelBuffer(from image: CGImage, width: Int, height: Int) throws -> CVPixelBuffer {
    let attrs: [CFString: Any] = [
        kCVPixelBufferCGImageCompatibilityKey: true,
        kCVPixelBufferCGBitmapContextCompatibilityKey: true,
    ]

    var maybeBuffer: CVPixelBuffer?
    let status = CVPixelBufferCreate(
        kCFAllocatorDefault,
        width,
        height,
        kCVPixelFormatType_32BGRA,
        attrs as CFDictionary,
        &maybeBuffer
    )

    guard status == kCVReturnSuccess, let buffer = maybeBuffer else {
        throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not create pixel buffer"])
    }

    CVPixelBufferLockBaseAddress(buffer, [])
    defer { CVPixelBufferUnlockBaseAddress(buffer, []) }

    guard let baseAddress = CVPixelBufferGetBaseAddress(buffer) else {
        throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not access pixel buffer memory"])
    }

    let bytesPerRow = CVPixelBufferGetBytesPerRow(buffer)
    guard let context = CGContext(
        data: baseAddress,
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: bytesPerRow,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
    ) else {
        throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not create CGContext"])
    }

    context.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
    context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))

    return buffer
}

func encode(options: Options) throws {
    let framesDir = options.framesDir!
    let output = options.output!
    let frames = try pngFrames(in: framesDir)

    try? FileManager.default.removeItem(at: output)
    try FileManager.default.createDirectory(at: output.deletingLastPathComponent(), withIntermediateDirectories: true)

    let writer = try AVAssetWriter(outputURL: output, fileType: .mp4)
    let settings: [String: Any] = [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: options.width,
        AVVideoHeightKey: options.height,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: 12_000_000,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        ],
    ]

    let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
    input.expectsMediaDataInRealTime = false

    let adaptor = AVAssetWriterInputPixelBufferAdaptor(
        assetWriterInput: input,
        sourcePixelBufferAttributes: [
            kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
            kCVPixelBufferWidthKey as String: options.width,
            kCVPixelBufferHeightKey as String: options.height,
        ]
    )

    guard writer.canAdd(input) else {
        throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not add video input"])
    }
    writer.add(input)

    guard writer.startWriting() else {
        throw writer.error ?? NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not start writing"])
    }
    writer.startSession(atSourceTime: .zero)

    let frameDuration = CMTime(value: 1, timescale: options.fps)
    let queue = DispatchQueue(label: "figma2demo.encode")
    let semaphore = DispatchSemaphore(value: 0)
    var encodeError: Error?
    var frameIndex: Int64 = 0

    input.requestMediaDataWhenReady(on: queue) {
        while input.isReadyForMoreMediaData && frameIndex < Int64(frames.count) {
            do {
                let image = try loadCGImage(frames[Int(frameIndex)])
                let pixelBuffer = try makePixelBuffer(from: image, width: options.width, height: options.height)
                let presentationTime = CMTimeMultiply(frameDuration, multiplier: Int32(frameIndex))
                if !adaptor.append(pixelBuffer, withPresentationTime: presentationTime) {
                    throw writer.error ?? NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not append frame \(frameIndex)"])
                }
                if frameIndex % Int64(options.fps) == 0 {
                    print("encoded \(frameIndex + 1)/\(frames.count)")
                }
                frameIndex += 1
            } catch {
                encodeError = error
                input.markAsFinished()
                writer.cancelWriting()
                semaphore.signal()
                return
            }
        }

        if frameIndex >= Int64(frames.count) {
            input.markAsFinished()
            writer.finishWriting {
                semaphore.signal()
            }
        }
    }

    semaphore.wait()

    if let encodeError {
        throw encodeError
    }
    if writer.status != .completed {
        throw writer.error ?? NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "Writer did not complete"])
    }

    let duration = Double(frames.count) / Double(options.fps)
    print("wrote \(output.path)")
    print("metadata width=\(options.width) height=\(options.height) fps=\(options.fps) duration=\(String(format: "%.2f", duration))s frames=\(frames.count)")
}

do {
    try encode(options: parseOptions())
} catch {
    fputs("error: \(error.localizedDescription)\n", stderr)
    exit(1)
}
