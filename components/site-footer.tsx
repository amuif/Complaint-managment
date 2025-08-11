'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/components/language-provider';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logos-removebg-preview-ZSzaSFuDxZhWUNiUwKrbxsvdKDd6MU.png"
                  alt="FM Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <span className="font-bold">{t('appName')}</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t('footerTagline')}</p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t('services')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary">
                  {t('allServices')}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/requirements"
                  className="text-muted-foreground hover:text-primary"
                >
                  {t('requirements')}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/standards"
                  className="text-muted-foreground hover:text-primary"
                >
                  {t('standards')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t('feedback')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/feedback" className="text-muted-foreground hover:text-primary">
                  {t('giveFeedback')}
                </Link>
              </li>
              <li>
                <Link href="/complaints" className="text-muted-foreground hover:text-primary">
                  {t('fileComplaint')}
                </Link>
              </li>
              <li>
                <Link href="/complaints/track" className="text-muted-foreground hover:text-primary">
                  {t('trackComplaint')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t('contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-muted-foreground">{t('address')}</li>
              <li className="text-muted-foreground">{t('phone')}: +251 11 123 4567</li>
              <li className="text-muted-foreground">{t('email')}: info@example.gov.et</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
