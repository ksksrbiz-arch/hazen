import {createRemoteJWKSet,jwtVerify} from 'jose';
let jwks,issuer;
export class ConfigError extends Error{}
export async function editor(request,env,keys){
 if(!env.ACCESS_AUD||!env.ACCESS_TEAM_DOMAIN||!env.EDITOR_EMAILS)throw new ConfigError('Editor authentication is not configured');
 const token=request.headers.get('cf-access-jwt-assertion')||request.headers.get('cookie')?.match(/(?:^|;\s*)CF_Authorization=([^;]+)/)?.[1];
 if(!token)throw new Error('Sign in to the listing studio');
 if(issuer!==env.ACCESS_TEAM_DOMAIN){issuer=env.ACCESS_TEAM_DOMAIN;jwks=createRemoteJWKSet(new URL(issuer+'/cdn-cgi/access/certs'));}
 const {payload}=await jwtVerify(token,keys||jwks,{issuer:env.ACCESS_TEAM_DOMAIN,audience:env.ACCESS_AUD,algorithms:['RS256'],requiredClaims:['exp','sub','email']});
 const email=String(payload.email).toLowerCase();
 if(!env.EDITOR_EMAILS.split(',').map(x=>x.trim().toLowerCase()).includes(email))throw new Error('Editor access denied');
 return email;
}
export function mutationAllowed(request){return request.headers.get('origin')===new URL(request.url).origin;}
