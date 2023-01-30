import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';


const CSV_EXTENSION = '.csv';
const XML_EXTENSION = '.xml';
const CSV_TYPE = 'text/csv';
const XML_TYPE = 'application/xml';

@Injectable({
  providedIn: 'root'
})
export class ExportService {


  private saveAsFile(buffer: any, fileName: string, fileType: string): void {
    const data: Blob = new Blob([buffer], { type: fileType });
    FileSaver.saveAs(data, fileName);
  }

  public exportFile(rows: any[], fileName: string, fileType: string, columns?: string[]): string {
    if (!rows || !rows.length) {
      return 'Error occured while exporting file';
    }

    const separator = ',';
    const keys = Object.keys(rows[0]).filter(k => {
      if (columns?.length) {
        return columns.includes(k);
      } else {
        return true;
      }
    });
    const content = keys.join(separator) + '\n' + rows.map(row => {
      return keys.map(k => {
        let cell = row[k] === undefined || row[k] === null ? '' : row[k];
        cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(separator);
    }).join('\n');

    if (fileType === 'xml') {
      this.saveAsFile(content, `${fileName}${XML_EXTENSION}`, XML_TYPE);
    } else {
      this.saveAsFile(content, `${fileName}${CSV_EXTENSION}`, CSV_TYPE);
    }

    return fileType + ' export complete';
  }


}
