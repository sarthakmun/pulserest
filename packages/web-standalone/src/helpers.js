// packages/web-standalone/src/helpers.js
import fs from 'fs/promises'
import path from 'path'
import { platform } from 'os'
import * as fileUtils from './file-utils.js'

export function removePrefixFromString(str, prefix) {
    if (str.startsWith(prefix)) {
        let result = str.slice(prefix.length)
        if (platform() === 'win32') {
            result = result.replaceAll(path.win32.sep, path.posix.sep)
        }
        return result
    }
    return str
}

export async function browseDirectory(dirPath) {
    let resolvedPath = dirPath ? path.resolve(dirPath) : process.cwd()

    const stat = await fs.stat(resolvedPath)
    if (!stat.isDirectory()) {
        throw new Error('Path is not a directory')
    }

    const entries = await fs.readdir(resolvedPath, { withFileTypes: true })

    const directories = entries
        .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
        .map(entry => ({
            name: entry.name,
            path: path.join(resolvedPath, entry.name),
        }))
        .sort((a, b) => a.name.localeCompare(b.name))

    const parentPath = path.dirname(resolvedPath)

    return {
        currentPath: resolvedPath,
        parentPath: parentPath !== resolvedPath ? parentPath : null,
        directories,
    }
}

export async function readFile(filePath, workspaceLocation = null) {
    let resolved = ''
    let exists = false

    if (workspaceLocation !== null) {
        resolved = path.resolve(path.join(workspaceLocation, filePath))
        exists = await fileUtils.pathExists(resolved)
    }

    if (!exists) {
        resolved = path.resolve(filePath)
        exists = await fileUtils.pathExists(resolved)
    }

    if (!exists) {
        return { error: `Cannot find file: ${resolved}`, content: null }
    }

    try {
        return { error: null, content: await fs.readFile(resolved, 'utf8') }
    } catch (error) {
        return { error: error.message + ' ' + resolved, content: null }
    }
}
