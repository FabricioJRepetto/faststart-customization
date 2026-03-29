export const assetName = (fileName: string): string => {
    return fileName.replace(/^[A-Z]*_/i, '').split('.')[0]
}
