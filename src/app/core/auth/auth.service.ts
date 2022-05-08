import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;
    private baseUrl: string;

    getHeader(): HttpHeaders {
        return localStorage.getItem('accessToken') ? new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            'id': localStorage.getItem('userId'),
            "Authorization": "Bearer " + localStorage.getItem('accessToken')
        }) : new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            'Content-Type': 'application/json'
        });
    }

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _router: Router,
        @Inject('BASE_URL') _baseUrl: string
    ) {
        this.baseUrl = environment.api; //_baseUrl
        // localStorage.removeItem('accessToken')
        // localStorage.removeItem('userId');
        // localStorage.removeItem('email');
        // localStorage.removeItem('user');
        // localStorage.removeItem('accessToken');
        // this._authenticated = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(this.baseUrl + 'api/token/forgot-password?email=' + email, email, { headers: this.getHeader() });
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(reset: string, password: string): Observable<any> {
        return this._httpClient.post(this.baseUrl + 'api/token/reset-password', { reset: reset, password: password }, { headers: this.getHeader() });
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(this.baseUrl + 'api/token', credentials, { headers: this.getHeader() }).pipe(
            switchMap((response: any) => {
                //console.log('response', response);

                // Store the access token in the local storage
                this.accessToken = response.accessToken;
                localStorage.setItem('accessToken', this.accessToken);
                localStorage.setItem('userId', response.user.userId);
                localStorage.setItem('email', credentials.email);
                localStorage.setItem('user', JSON.stringify(response.user));

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Renew token
        return this._httpClient.post(this.baseUrl + 'api/token/refresh', {
            email: localStorage.getItem('email'),
            accessToken: this.accessToken
        }, { headers: this.getHeader() }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {
                console.log('response', response);

                if (response.user) {
                    // Store the access token in the local storage
                    this.accessToken = response.accessToken;
                    localStorage.setItem('accessToken', this.accessToken);
                    localStorage.setItem('userId', response.user.userId);
                    localStorage.setItem('user', JSON.stringify(response.user))

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                }else{
                    return of(false);
                }
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        this._userService.user = null;

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { company: string; firstName: string; lastName: string; phone: string; email: string; password: string, vehicles: boolean, loads: boolean, bids: boolean }): Observable<any> {
        return this._httpClient.post(this.baseUrl + 'api/users', user, { headers: this.getHeader() });
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post(this.baseUrl + 'api/token/unlock-session', credentials, { headers: this.getHeader() });
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('user');
            this._router.navigateByUrl('/sign-in');
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
