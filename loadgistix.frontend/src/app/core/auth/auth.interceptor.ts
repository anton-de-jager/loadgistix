import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { environment } from 'environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    // Clone the request object
    let newReq = req.clone();

    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    if (authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken)) {
        if (newReq.url.indexOf(environment.paystack_url) < 0) {
            newReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + authService.accessToken),
            });
        }
    }

    // Response
    return next(newReq).pipe(
        catchError((error) => {
            // Catch "401 Unauthorized" responses
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // Don't sign out for image upload endpoints - these may fail due to
                // external authentication service issues, not actual auth problems
                const isUploadEndpoint = req.url.includes('/uploadImage/') || req.url.includes('/uploadImagePdp/');
                
                if (!isUploadEndpoint) {
                    // Sign out
                    authService.signOut();

                    // Reload the app
                    location.reload();
                } else {
                    console.warn('Image upload failed with 401 - not signing out user');
                }
            }

            return throwError(error);
        }),
    );
};
