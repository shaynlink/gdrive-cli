const kilobyte = 1024;
const megabyte = kilobyte * 1024;
const gigabyte = megabyte * 1024;

export function convertBytes(bytes) {
  if (bytes < kilobyte) {
    return bytes + ' B';
  } else if (bytes < megabyte) {
    return (bytes / kilobyte).toFixed(2) + ' KB';
  } else if (bytes < gigabyte) {
    return (bytes / megabyte).toFixed(2) + ' MB';
  } else {
    return (bytes / gigabyte).toFixed(2) + ' GB';
  }
}