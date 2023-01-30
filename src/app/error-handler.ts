import { ErrorHandler, Injectable } from "@angular/core";
import { throwError } from "rxjs";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    handleError(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(() => { return errorMessage; });
    }
}