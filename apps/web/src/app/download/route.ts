import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { basename, extname, isAbsolute, resolve } from 'node:path';
import { Readable } from 'node:stream';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const contentTypes: Record<string, string> = {
  '.7z': 'application/x-7z-compressed',
  '.dmg': 'application/x-apple-diskimage',
  '.gz': 'application/gzip',
  '.rar': 'application/vnd.rar',
  '.tar': 'application/x-tar',
  '.zip': 'application/zip',
};

const downloadArchives = new Set([
  'boston-sampler-installer.zip',
  'boston-sampler-portable.zip',
  'boston-sampler-x64.dmg',
  'boston-sampler-arm.dmg',
]);

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

export async function GET(request: Request) {
  const requestedFile = new URL(request.url).searchParams.get('file');

  if (requestedFile && (!downloadArchives.has(requestedFile) || requestedFile !== basename(requestedFile))) {
    return new Response('Unknown download file.', { status: 400 });
  }

  const configuredPath = requestedFile
    ? process.env.DOWNLOAD_DIR
      ? resolve(process.env.DOWNLOAD_DIR, requestedFile)
      : requestedFile
    : (process.env.DOWNLOAD_ARCHIVE_PATH ?? process.env.DOWNLOAD_ARCHIVE_NAME ?? 'boston-sampler-installer.zip');
  const { archivePath, archiveStat } = await findArchive(configuredPath);
  const archiveName = basename(configuredPath);
  const extension = extname(archiveName).toLowerCase();

  if (!contentTypes[extension]) {
    return new Response('Unsupported archive extension. Use .zip, .dmg, .rar, .7z, .tar or .gz.', { status: 400 });
  }

  if (!archiveStat) {
    return new Response(
      `Archive not found. Put ${archiveName} in the project root or set DOWNLOAD_DIR/DOWNLOAD_ARCHIVE_PATH.`,
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
