import * as path from "path";
import * as fs from "fs";

class Log {
  public baseDir: string;
  public fileName: string;
  public linePrefix: string;

  public today: Date = new Date();

  constructor() {
    let _dateString = `${this.today.getFullYear()}-${this.today.getMonth() + 1}-${this.today.getDate}`;
    let _timeString = `${this.today.getHours()}:${this.today.getMinutes()}:${this.today.getSeconds()}`;

    this.baseDir = path.join(__dirname, "../../.logs/");

    this.fileName = `${_dateString}.log`;
    this.linePrefix = `[${_dateString} ${_timeString}]`;
  }

  public info (_string: string): void {
    this.addLog('INFO', _string);
  }

  public warn (_string: string): void {
    this.addLog('WARN', _string);
  }

  public error (_string: string): void {
    console.log('\x1b[31m%s\x1b[0m', '[ERROR] :: ' + _string.split(/r?\n/)[0]);
    this.addLog('ERROR', _string);
  }

  public custom (_filename: string, _string: string): void {
    this.addLog(_filename, _string);
  }

  private addLog(_kind: string, _string: string): void {
    _kind = _kind.toUpperCase();

    fs.open(`${this.baseDir}${this.fileName}`, 'a', (_err, _fileDescriptor) => {
        if (!_err && _fileDescriptor) {
            fs.appendFile(_fileDescriptor, `${this.linePrefix} [${_kind}] ${_string}\n`, (_err) => {
                if (!_err) {
                    fs.close(_fileDescriptor, (_err) => {
                        if (!_err) {
                            return true;
                        } else {
                            return console.log('\x1b[31m%s\x1b[0m', 'Error closing log file that was being appended');
                        }
                    });
                } else {
                    return console.log('\x1b[31m%s\x1b[0m', 'Error appending to the log file');
                }
            });
        } else {
            return console.log('\x1b[31m%s\x1b[0m', 'Error cloudn\'t open the log file for appending');
        }
    });
  }
}

export default new Log;