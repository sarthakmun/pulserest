// packages/web-standalone/src/file-utils.js
import fs from 'fs/promises'
import path from 'path'

export async function readdirIgnoreError(dirPath) {
    try {
        return await fs.readdir(dirPath)
    } catch {
        return []
    }
}

export async function pathExists(pathToCheck) {
    return fs.access(pathToCheck).then(() => true).catch(() => false)
}

export function encodeFilename(name) {
    let encodedName = ''
    const forbiddenChars = {
        '<': '&lt;', '>': '&gt;', ':': '&#58;', '"': '&quot;',
        '/': '&#47;', '\\': '&#92;', '|': '&#124;', '?': '&#63;', '*': '&#42;',
    }
    for (let i = 0; i < name.length; i++) {
        const char = name[i]
        const code = name.charCodeAt(i)
        if (forbiddenChars[char]) {
            encodedName += forbiddenChars[char]
        } else if (code < 32) {
            encodedName += `&#${code};`
        } else {
            encodedName += char
        }
    }
    encodedName = encodedName.replace(/[ .]+$/, match =>
        match.split('').map(c => `&#${c.charCodeAt(0)};`).join('')
    )
    return encodedName
}

export function decodeFilename(name) {
    const decodeMap = {
        '&lt;': '<', '&gt;': '>', '&#58;': ':', '&quot;': '"',
        '&#47;': '/', '&#92;': '\\', '&#124;': '|', '&#63;': '?', '&#42;': '*',
    }
    for (let i = 0; i < 32; i++) {
        decodeMap[`&#${i};`] = String.fromCharCode(i)
    }
    const regex = new RegExp(Object.keys(decodeMap).join('|'), 'g')
    return name.replace(regex, matched => decodeMap[matched])
}

export async function writeFileJson(filePath, data, _fsLog, _reason) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 4))
}

export async function writeFileJsonNewOnly(filePath, data, _fsLog, _reason) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 4), { flag: 'wx' })
}

export async function writeEmptyFileNewOnly(filePath, _fsLog, _reason) {
    await fs.writeFile(filePath, '', { flag: 'wx' })
}

export async function deleteFileOrFolder(filePath, _fsLog, _reason) {
    const stat = await fs.stat(filePath)
    if (stat.isDirectory()) {
        // Use recursive removal to handle non-empty directories (e.g. folder groups with child requests)
        await fs.rm(filePath, { recursive: true, force: true })
    } else {
        await fs.unlink(filePath)
    }
}

export async function mkdir(dirPath, _fsLog, _reason) {
    await fs.mkdir(dirPath)
}

export async function renameFileOrFolder(oldPath, newPath, _fsLog, _reason) {
    try {
        await fs.rename(oldPath, newPath)
    } catch {
        // fallback for cross-device moves (shouldn't happen in Docker but just in case)
        await fs.cp(oldPath, newPath, { recursive: true })
        await fs.rm(oldPath, { recursive: true })
    }
}

export function transformFileObjectToSaveableFileObject(file) {
    if(file.bufferOmitted) {
        return { name: file.name, type: file.type, buffer: '', bufferOmitted: true }
    }
    return { name: file.name, type: file.type, buffer: Buffer.from(file.buffer).toString('base64') }
}

export function transformSavedFileObjectToFileObject(file) {
    if(file.bufferOmitted) {
        return { name: file.name, type: file.type, buffer: [], bufferOmitted: true }
    }
    return { name: file.name, type: file.type, buffer: Array.from(Buffer.from(file.buffer, 'base64')) }
}
