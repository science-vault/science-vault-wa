// Permission decisions use Firestore account documents, never a local role choice.
export function canOpenPage(state,page){
 if(!state?.user||state.error)return false;
 if(state.admin)return true;
 const member=state.member;
 if(!member||!['student','teacher'].includes(member.role)||member.status!=='active')return false;
 if(member.role==='teacher'&&!state.user.emailVerified)return false;
 const value=member.permissions?.[page.id];
 return typeof value==='boolean'?value:member.role==='student'&&page.studentDefault===true;
}
export function accessReason(state){
 if(state?.error)return'Access settings could not be loaded. Please try again. The site owner may need to finish Firebase setup.';
 if(!state?.user)return'Log in or create an account to continue.';
 if(!state.member&&!state.admin)return'Choose your account type on the account page to finish registration.';
 if(state.member?.status==='pending')return'Your teacher account is waiting for approval from the site owner.';
 if(state.member?.status==='suspended')return'Access to this account has been suspended. Contact the site owner.';
 if(state.member?.role==='teacher'&&!state.user.emailVerified)return'Verify your email on the account page before using your approved teacher access.';
 return'This page is not included in your account access. Contact the site owner if you need it.';
}
