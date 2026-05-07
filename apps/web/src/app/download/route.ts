import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { basename, extname, isAbsolute, resolve } from 'node:path';
import { Readable } from 'node:stream';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const contentTypes: Record<string, string> = {
  '.7z': 'application/x-7z-compressed',
  '.gz': 'application/gzip',
  '.rar': 'application/vnd.rar',
  '.tar': 'application/x-tar',
  '.zip': 'application/zip',
};

async function findArchive(configuredPath: string) {
  const archivePathCandidates = isAbsolute(configuredPath)
    ? [resolve(configuredPath)]
    : Array.from(
        new Set(
          [
            process.cwd(),
            process.env.INIT_CWD,
            resolve(process.cwd(), '..', '..'),
            process.env.INIT_CWD ? resolve(process.env.INIT_CWD, '..', '..') : undefined,
          ]
            .filter(Boolean)
            .map((root) => resolve(root as string, configuredPath)),
        ),
      );

  for (const archivePath of archivePathCandidates) {
    try {
      const archiveStat = await stat(archivePath);

      if (archiveStat.isFile()) {
        return { archivePath, archiveStat };
      }
    } catch {
      // Try the next likely project root.
    }
  }

  return { archivePath: archivePathCandidates[0], archiveStat: null };
}

export async function GET() {
  const configuredPath =
    process.env.DOWNLOAD_ARCHIVE_PATH ?? process.env.DOWNLOAD_ARCHIVE_NAME ?? 'bostoncrew-sampler.zip';
  const { archivePath, archiveStat } = await findArchive(configuredPath);
  const archiveName = basename(configuredPath);
  const extension = extname(archiveName).toLowerCase();

  if (!contentTypes[extension]) {
    return new Response('Unsupported archive extension. Use .zip, .rar, .7z, .tar or .gz.', { status: 400 });
  }

  if (!archiveStat) {
    return new Response(
      `Archive not found. Put ${archiveName} in the project root or set DOWNLOAD_ARCHIVE_PATH.`,
      { status: 404 },
    );
  }

  const stream = Readable.toWeb(createReadStream(archivePath));

  return new Response(stream as ReadableStream, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(archiveName)}"`,
      'Content-Length': String(archiveStat.size),
      'Content-Type': contentTypes[extension],
    },
  });
}
