'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, FileText, MessageCircle } from 'lucide-react'
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { FeedbackModal } from '@/components/FeedbackModal'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Documentation', icon: <FileText className="h-4 w-4" /> },
    { href: '/user-forms', label: 'My Reports', icon: <FileText className="h-4 w-4" /> },
    { href: '/about', label: 'About', icon: <MessageCircle className="h-4 w-4" /> },
    { href: '/contact', label: 'Contact', icon: <MessageCircle className="h-4 w-4" /> }
  ]

  return (
    <header className="bg-white border-b border-neutral-200 py-3 shadow-sm print:hidden">
      <FeedbackModal open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen} />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-law-blue-800 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              MedLegal Scribe
            </Link>
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-neutral-600 hover:text-law-blue-700 px-3 py-2 hover:bg-law-blue-50 rounded-md transition-all duration-200"
                >
                  <span className="flex items-center">
                    {item.icon}
                    <span className="ml-1.5">{item.label}</span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsFeedbackOpen(true)}
                className="text-sm font-medium text-law-blue-700 border-law-blue-200 hover:bg-law-blue-50 rounded-md"
              >
                <MessageCircle className="h-4 w-4 mr-1.5" />
                Feedback
              </Button>
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonBox: "hover:opacity-80 transition-opacity"
                    }
                  }}
                />
              </SignedIn>
            </div>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5 text-law-blue-700" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-white">
                <nav className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-2 text-neutral-600 hover:text-law-blue-700 px-3 py-2 hover:bg-law-blue-50 rounded-md transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-neutral-200">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsFeedbackOpen(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full text-sm font-medium text-law-blue-700 border-law-blue-200 hover:bg-law-blue-50 rounded-md"
                    >
                      <MessageCircle className="h-4 w-4 mr-1.5" />
                      Feedback
                    </Button>
                  </div>
                  <div className="pt-2">
                    <SignedIn>
                      <UserButton 
                        appearance={{
                          elements: {
                            userButtonBox: "hover:opacity-80 transition-opacity"
                          }
                        }}
                      />
                    </SignedIn>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}