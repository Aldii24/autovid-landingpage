const PARTS = Array.from(
  {length: 9},
  (_, index) => `/downloads/chunks/AutoVid-0.1.0-x64.exe.part-${String(index).padStart(2, '0')}`,
);

const INSTALLER_SIZE = 210_188_008;

function headers() {
  return {
    'Cache-Control': 'public, max-age=86400, immutable',
    'Content-Disposition': 'attachment; filename="AutoVid-0.1.0-x64.exe"',
    'Content-Length': String(INSTALLER_SIZE),
    'Content-Type': 'application/vnd.microsoft.portable-executable',
  };
}

export async function GET(request: Request) {
  const {readable, writable} = new TransformStream<Uint8Array, Uint8Array>();

  void (async () => {
    const writer = writable.getWriter();
    try {
      for (const part of PARTS) {
        const response = await fetch(new URL(part, request.url));
        if (!response.ok || !response.body) {
          throw new Error(`Installer part unavailable: ${part}`);
        }

        const reader = response.body.getReader();
        while (true) {
          const {done, value} = await reader.read();
          if (done) break;
          await writer.write(value);
        }
      }
      await writer.close();
    } catch (error) {
      await writer.abort(error);
    }
  })();

  return new Response(readable, {headers: headers()});
}

export function HEAD() {
  return new Response(null, {headers: headers()});
}
