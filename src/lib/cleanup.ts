import consola from "consola";
import fs from "fs";
import path from "path";

/**
 * This script is designed to clean up directories and files listed after a build process is completed.
 * It specifically targets removing files that were required before bundling by webpack.
 * The script is intended to be called by the build script as part of the post-build cleanup process.
 */
(() => {
  const directoriesToRemove: string[] = ["dist"];
  const exceptions: string[] = ["main.bundle.js", "main.bundle.js.LICENSE.txt"];

  let totalFiles = 0;
  let totalDirs = 0;

  const countFilesAndDirs = (dirPath: string): void => {
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach((entry: string) => {
        const entryPath = path.join(dirPath, entry);
        if (fs.lstatSync(entryPath).isDirectory()) {
          totalDirs++;
          countFilesAndDirs(entryPath);
        } else {
          totalFiles++;
        }
      });
    }
  };

  const removeDir = (dirPath: string, exceptions: string[]): void => {
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach((entry: string) => {
        const entryPath = path.join(dirPath, entry);
        if (fs.lstatSync(entryPath).isDirectory()) {
          removeDir(entryPath, exceptions);
        } else {
          if (!exceptions.includes(entry)) {
            fs.unlinkSync(entryPath);
            consola.success(`File Removed: ${entryPath}`);
          } else {
            consola.info(`File Skipped: ${entryPath} (Exception)`);
          }
        }
      });

      if (fs.readdirSync(dirPath).length === 0) {
        fs.rmdirSync(dirPath);
        consola.success(`Directory Removed: ${dirPath}`);
      } else {
        consola.info(`Directory Skipped: ${dirPath} (Contains Files)`);
      }
    } else {
      consola.error(`Directory Not Found: ${dirPath}`);
    }
  };

  consola.info(
    `\x1b[36m[cleanup]: Cleaning up directories [${directoriesToRemove.join(
      ", "
    )}]\x1b[0m`
  );

  const startTime = Date.now();

  directoriesToRemove.forEach((dir) => {
    countFilesAndDirs(dir);
  });

  directoriesToRemove.forEach((dir) => {
    removeDir(dir, exceptions);
  });

  const endTime = Date.now();
  const elapsedTimeInSeconds = (endTime - startTime) / 1000;

  consola.success(
    `\x1b[32m[cleanup]: Cleanup completed in ${elapsedTimeInSeconds} seconds\x1b[0m`
  );
})();
