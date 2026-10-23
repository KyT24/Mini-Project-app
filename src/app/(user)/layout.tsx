import Footer from "@/components/user/footer";
import Navbar from "@/components/user/navbar";

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return(
        <>
        <Navbar />
        <div>{children}</div>
        <Footer />
        </>
    )
}