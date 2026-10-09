export function accountError(error){const messages={
 'auth/invalid-email':'Enter a valid email address.',
 'auth/invalid-credential':'The email or password is incorrect.',
 'auth/user-not-found':'The email or password is incorrect.',
 'auth/wrong-password':'The email or password is incorrect.',
 'auth/email-already-in-use':'Unable to create this account. Try logging in or resetting your password.',
 'auth/weak-password':'Choose a stronger password. Use at least 8 characters.',
 'auth/password-does-not-meet-requirements':'Your password does not meet the site’s password requirements. Try a longer password with uppercase and lowercase letters, numbers and a symbol.',
 'auth/too-many-requests':'Too many attempts. Please wait a little before trying again.',
 'auth/network-request-failed':'Could not connect. Check your internet connection and try again.',
 'auth/user-disabled':'This account has been disabled. Contact the site owner.',
 'auth/configuration-not-found':'Accounts are not available yet. The site owner needs to set up Firebase Authentication and enable Email/Password.',
 'auth/operation-not-allowed':'Email/password accounts have not been enabled yet. The site owner needs to enable Email/Password in Firebase Authentication.',
 'auth/unauthorized-domain':'The site owner needs to add science-vault.github.io to Firebase Authentication’s authorized domains.',
 'auth/invalid-api-key':'The account service configuration needs to be checked by the site owner.',
 'auth/app-not-authorized':'The account service configuration needs to be checked by the site owner.'
};return messages[error?.code]||'The request could not be completed. Please try again.'}
export function signupProblem(password,confirmation){if(password.length<8)return'Use at least 8 characters for your password.';if(password!==confirmation)return'The two passwords do not match.';return''}
