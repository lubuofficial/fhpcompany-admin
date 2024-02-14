import clientPromise from '@/lib/mongodb'
import { mongooseConnect } from '@/lib/mongoose';
import { Admin } from '@/models/Admin';
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
// import EmailProvider from 'next-auth/providers/email'

async function isAdminEmail(email) {
  // to add admin if no admin on the page use:
  // return true;
  return !! (await Admin.findOne({email}));
}

export const authOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    // Passwordless / email sign in
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: 'NextAuth.js <no-reply@example.com>'
    // }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callback: {
    session: async ({session,token,user}) => {
      if (await isAdminEmail(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req,res) {
  const session = await getServerSession(req,res,authOptions);
  if (!(await isAdminEmail(session?.user?.email))) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}