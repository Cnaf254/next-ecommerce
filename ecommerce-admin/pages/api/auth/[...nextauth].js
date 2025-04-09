import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";

const adminEmails = ['eshetugezu16@gmail.com']

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent select_account", 
        },
      }, 
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  callbacks:{
  session: ({session,token,user})=>{
    
    if (adminEmails.includes(session?.user?.email)){
      
      return session;
    } else{
      return false;
    }
    
  },
  }
}

export default NextAuth(authOptions);

export async function isAdminRequest (req,res)
{
  const session = await getServerSession(req,res,authOptions);

  if(!adminEmails.includes(session?.user?.email)){
    res.status(401).json({error: "You are not an admin"});
    res.end();
  }
}