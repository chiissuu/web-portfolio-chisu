"""One second of 32x32 RGB frames and an 8000 Hz sine; no personal media."""
import math
import struct
from pathlib import Path

def chunk(name, data):
    return name + struct.pack('<I', len(data)) + data + (b'\0' if len(data) % 2 else b'')

def group(name, data):
    return chunk(b'LIST', name + data)

def stream(kind, codec, scale, rate, length, sample, fmt, rect=(0, 0, 0, 0)):
    header = struct.pack('<4s4sIHHIIIIIIIIhhhh', kind, codec, 0, 0, 0, 0,
                         scale, rate, 0, length, 3200, 0xffffffff, sample, *rect)
    return group(b'strl', chunk(b'strh', header) + chunk(b'strf', fmt))

main = struct.pack('<14I', 200000, 32000, 0, 0, 5, 0, 2, 3200, 32, 32, 0, 0, 0, 0)
bitmap = struct.pack('<IiiHHIIiiII', 40, 32, 32, 1, 24, 0, 3072, 0, 0, 0, 0)
wave = struct.pack('<HHIIHHH', 1, 1, 8000, 16000, 2, 16, 0)
headers = group(b'hdrl', chunk(b'avih', main)
                + stream(b'vids', b'DIB ', 1, 5, 5, 0, bitmap, (0, 0, 32, 32))
                + stream(b'auds', b'\0' * 4, 2, 16000, 8000, 2, wave))
frames = b''
for frame in range(5):
    pixels = bytes([40, 80 + frame * 20, 160]) * 1024
    audio = b''.join(struct.pack('<h', int(4000 * math.sin(2 * math.pi * 440 * i / 8000)))
                     for i in range(frame * 1600, (frame + 1) * 1600))
    frames += chunk(b'00db', pixels) + chunk(b'01wb', audio)
root = Path(__file__).parent
root.joinpath('sintetico.avi').write_bytes(chunk(b'RIFF', b'AVI ' + headers + group(b'movi', frames)))
root.joinpath('vacio.mp4').write_bytes(b'')
root.joinpath('incompatible.txt').write_text('Synthetic unsupported file', encoding='utf-8')
root.joinpath('corrupto.mp4').write_bytes(b'Synthetic invalid video')
print('Synthetic files generated:', root.joinpath('sintetico.avi').stat().st_size, 'bytes')
