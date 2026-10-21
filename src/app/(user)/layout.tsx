import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return(
        <>
        <Navbar />
        <div>{children}</div>
        <Footer />
        </>
    )
}