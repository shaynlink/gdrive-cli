# Gdrive CLI

Gdrive CLI is a command line tool for interacting with Google Drive.

> ⚠️ **Note:** This is a work in progress. The tool is not yet fully functional.

## Installation

```bash
npm install -g https://github.com/shaynlink/gdrive-cli
```

## Configuration file

The configuration file is located at `~/.gdrive-cli`.

```json
{
  "google_credentials_path": "/path/to/credentials.json",
  "google_token_path": "/path/to/token.json"
}
```

## Usage

```bash
gdrive [command] [options]
```

## Basic authentification (beta)

Get google cloud credential and google token paths

```bash
gdrive config-set google_credentials_path /path/to/credentials.json
gdrive config-set google_token_path /path/to/token.json
```

## Debug

To enable debug mode, set the `DEBUG` environment variable to `gdrive-cli`.

```bash
DEBUG=gdrive-cli gdrive [command] [options]
```

## Commands

- [ ] `auth` - Authenticate with Google Drive
- [ ] `ls` - List files in Google Drive
- [ ] `upload` - Upload a file to Google Drive
- [x] `config-set` - Set configuration options
- [x] `config-get` - Get configuration options
- [x] `config-list` - List configuration options
- [x] `copy-all` - Copy all files from one folder to another
- [x] `copy` - Copy a file from one folder to another
- [x] `help` - Display help information
- [x] `file` - Display file information
- [x] `move-all` - Move all files from one folder to another
- [x] `move` - Move a file from one folder to another
- [] `remove` - Remove a file from Google Drive
- [] `remove-all` - Remove all files from Google Drive