import type { Config } from '@netlify/functions';

export default async (req: Request) => {
 const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
 if(req.method!=='POST')return new Response(null,{status:405,headers:{...headers,Allow:'POST'}});
 const origin=req.headers.get('origin');
 if(!origin||origin!==new URL(req.url).origin)return new Response(null,{status:403,headers});
 if(!req.headers.get('content-type')?.startsWith('application/json'))return new Response(null,{status:415,headers});
 const text=await req.text();if(text.length>200)return new Response(null,{status:413,headers});
 let data;try{data=JSON.parse(text);}catch{return new Response(null,{status:400,headers});}
 if(!data||!['product_choice','inquiry_start','inquiry_success'].includes(data.event)||!['customer','provider'].includes(data.audience)||Object.keys(data).some(k=>!['event','audience'].includes(k)))return new Response(null,{status:400,headers});
 console.log(JSON.stringify({type:'smoothscar_conversion',event:data.event,audience:data.audience}));
 return new Response(null,{status:204,headers});
};
export const config: Config={rateLimit:{action:'rate_limit',aggregateBy:'ip',windowSize:60,windowLimit:20}};
