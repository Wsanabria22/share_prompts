import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from '@models/user';

// console.log(
//   {
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   }
// )

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({session}) {
      const sessionUser = await User.findOne({ email: session.user.email });
      // console.log('sessionUser:',sessionUser)
      session.user.id = sessionUser._id.toString();
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();
        const userExists = await User.findOne({ email: profile.email });
        if(!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ","").toLowerCase().slice(0,15),
            image: profile.picture,
          })
        } else {
          console.log('Sign In Info: Usuario ya existe')
        }
        return true;
      } catch (error) {
        console.log('Sign In Error:',error)
        return false;
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST };
