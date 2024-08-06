async function manipulateOPFS() {
    const opfsRoot = await navigator.storage.getDirectory();
    const fileHandle = await opfsRoot.getFileHandle("high-scores", { create: true });
    const accessHandle = await fileHandle.createSyncAccessHandle();
    
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();
    
    // Initialize this variable for the size of the file.
    let size;
    // The current size of the file, initially `0`.
    size = accessHandle.getSize();
    console.log('size: ' + size)
    // Encode content to write to the file.
    const content = textEncoder.encode("");
    // Write the content at the beginning of the file.
    accessHandle.write(content, { at: 0 });
    // flush: persists any changes made to the file associated with the handle via the write() method to disk.
    accessHandle.flush();
    // The current size of the file, now '56` (the length of "Lorem ipsum...").
    size = accessHandle.getSize();
    console.log('size update 1: ' + size)

    // Encode more content to write to the file.
    const moreContent = textEncoder.encode("");
    // Write the content at the end of the file.
    accessHandle.write(moreContent, { at: size });
    // Flush the changes.
    accessHandle.flush();
    // The current size of the file, now `100` (the length of
    // "Some textMore content").
    size = accessHandle.getSize();
    console.log('size update 2: ' + size)

    // Prepare a data view of the length of the file.
    const dataView = new DataView(new ArrayBuffer(size));
    
    // Read the entire file into the data view.
    accessHandle.read(dataView);
    // Logs `"Some textMore content"`.
    console.log('dataView: ' + textDecoder.decode(dataView));
    
    // Read starting at offset 9 into the data view.
    accessHandle.read(dataView, { at: 0 });
    // Logs `"More content"`.
    console.log(textDecoder.decode(dataView));
    
    // Truncate the file after 4 bytes.
    //accessHandle.truncate(4);
    
}

manipulateOPFS()

function newFunction() {
    getFileHandle()
}