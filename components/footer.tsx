'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/components/language-provider';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="FM Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="font-bold">{t('appName')}</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t('footerTagline')}</p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t('services')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-foreground">
                  {t('allServices')}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/requirements"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {t('requirements')}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/standards"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {t('standards')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t('feedback')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/feedback" className="text-muted-foreground hover:text-foreground">
                  {t('giveFeedback')}
                </Link>
              </li>
              <li>
                <Link href="/complaints" className="text-muted-foreground hover:text-foreground">
                  {t('fileComplaint')}
                </Link>
              </li>
              <li>
                <Link
                  href="/complaints/track"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {t('trackComplaint')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t('contact')}</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">{t('address')}</li>
              <li className="text-muted-foreground">{t('phone')}: +251 11 123 4567</li>
              <li className="text-muted-foreground">{t('email')}: info@example.gov.et</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
