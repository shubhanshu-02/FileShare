import { ArrowRight, Download, Folder, Search, Shield, Upload, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "../../components/ui/button";

export default function LandingPage(){
    return (
        <div className="bg-muted">
      <header className="border-b backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2">
            <Folder className="h-8 w-8 text-blue-500" />
            <span className="font-bold text-3xl">FileShare</span>
          </Link>
          <nav className="hidden md:flex items-center gap-11">
            <Link href="#features" className="text-gray-200 text-xl hover:text-blue-500">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-200 text-xl hover:text-blue-500">
              How It Works
            </Link>
            <Link href="#faq" className="text-gray-200 text-xl hover:text-blue-500">
              FAQ
            </Link>
          </nav>
          <Link href="/">
            <Button>
                <div className="text-lg">
                    Launch App
                </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-30 px-4 bg-background">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
            Instant, Secure File Transfers
            <br />
            {/* —  */}
            <span className="text-blue-500">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Manage and share files instantly. No signup required, <br /> no complicated interface. Just drag, drop, and share.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center p-5">
            <Link href="/drive">
              <Button size="xl" className="px-8">
                <div className="text-lg">
                    Get Started
                </div>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="xl" variant="outline">
                <div className="text-lg">
                    Learn More
                </div>
              </Button>
            </Link>
          </div>
        </div>

          <div className="mt-20 mx-auto max-w-6xl">
            <img 
              src="ss.png"
              alt="FileShare Interface"
              className=" rounded-sm shadow-xl shadow-blue-500/50 border-25 border-zinc-800"
            />
          </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-20">Key Features</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="bg-background p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Simple Uploads</h3>
              <p className="text-xl text-gray-400">
                Drag and drop files or use the file picker. Upload multiple files at once with progress tracking.
              </p>
            </div>

            <div className="bg-background p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Folder className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Folder Organization</h3>
              <p className="text-xl text-gray-400">
                Create folders to organize your files. Sort by name, size, or upload date to find what you need.
              </p>
            </div>

            <div className="bg-background p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Easy Sharing</h3>
              <p className="text-xl text-gray-400">Share files with anyone. No account required to download shared files.</p>
            </div>

            <div className="bg-background p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Filter & Search</h3>
              <p className="text-xl text-gray-400">
                Filter files by type or use the search function to find specific files quickly.
              </p>
            </div>

            <div className="bg-background p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No Sign Up</h3>
              <p className="text-xl text-gray-400">
                Start using the service immediately. No accounts, no passwords, no email verification.
              </p>
            </div>

            <div className="bg-background p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Privacy Focused</h3>
              <p className="text-xl text-gray-400">
                We don't track users or collect personal data. Your files are your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-15 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto py-6 mb-10">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-2">Visit the App</h3>
              <p className="text-xl text-gray-400">Open FileShare in your browser. No account creation required.</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-2">Upload Files</h3>
              <p className="text-xl text-gray-400">Drag and drop your files or use the uploader. Create folders to organize.</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-2">Share & Download</h3>
              <p className="text-xl text-gray-400">Share the file link with others or download when you need your files.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-5xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="bg-background p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold mb-2">How long are files stored?</h3>
              <p className="text-xl text-gray-400">
                Files are stored for 365 days after the last access. If a file isn't accessed for 365 days, it will be automatically removed.
              </p>
            </div>

            <div className="bg-background p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold mb-2">Is there a size limit for uploads?</h3>
              <p className="text-xl text-gray-400">
                Yes, the maximum file size is 100MB per file. There's also a limit of 1GB total storage per session.
              </p>
            </div>

            <div className="bg-background p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold mb-2">Can I password protect my files?</h3>
              <p className="text-xl text-gray-400">
                Not currently. Since FileShare is designed for simplicity, we don't offer password protection. For sensitive files, we recommend using an traditional service.
              </p>
            </div>

            <div className="bg-background p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold mb-2">Can I create a permanent account?</h3>
              <p className="text-xl text-gray-400">
                FileShare is designed to be account-free. If you need persistent storage with an account, you might want to use some other cloud storage service.
              </p>
            </div>
          </div>
        </div>
      </section>

    {/* end Section */}
      <section className="py-15 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-2xl mb-10 max-w-4xl mx-auto">
            Experience hassle-free file sharing in seconds. No signup, no commitment.
          </p>
          <Link href="/drive">
            <Button size="xl" variant="default" className="px-8">
            <div className="text-2xl">
                    FileShare
                </div>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Folder className="h-8 w-8 text-blue-500" />
            <span className="font-bold text-2xl">FileShare</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <Link href="#features" className="hover:text-white">
                Features
              </Link>
              <Link href="#how-it-works" className="hover:text-white">
                How It Works
              </Link>
              <Link href="#faq" className="hover:text-white">
                FAQ
              </Link>
              <Link href="/" className="hover:text-white">
                Terms
              </Link>
              <Link href="/" className="hover:text-white">
                Privacy
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} FileShare. All rights reserved.
          </div>
        </div>
      </footer>


        </div>
    );
}