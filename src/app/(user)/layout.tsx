import { Suspense } from "react";
import Footer from "@/components/user/footer";
import Navbar from "@/components/user/navbar";

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return(
        <>
        {/* Navbar membaca usePathname(); di route dinamis (mis. /doctor/[doctorDetail])
            nilai ini baru tersedia saat runtime, jadi perlu Suspense (cacheComponents) */}
        <Suspense>
            <Navbar />
        </Suspense>
        <div>{children}</div>
        <Footer />
        </>
    )
}
