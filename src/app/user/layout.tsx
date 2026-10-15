import Footer from "@/compoonents/footer";
import Navbar from "@/compoonents/navbar";

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return(
        <>
        <Navbar />
        <div>{children}</div>
        <Footer />
        </>
    )
}