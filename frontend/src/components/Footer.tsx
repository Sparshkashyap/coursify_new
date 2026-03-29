import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-react";

const socialLinks = [
  { icon: Twitter, url: "https://x.com/SparshKashyap12", label: "Twitter" },
  { icon: Github, url: "https://github.com/Sparshkashyap/", label: "GitHub" },
  { icon: Linkedin, url: "https://www.linkedin.com/in/skcoder/", label: "LinkedIn" },
  { icon: Youtube, url: "https://www.youtube.com/@sparshkashyap513", label: "YouTube" },
];

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "About", path: "/about" },
  { name: "Pricing", path: "/pricing" },
];

const supportLinks = [
  { name: "Help Center", path: "/help" },
  { name: "Contact Us", path: "/contact" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms of Service", path: "/terms" },
  { name: "Refund Policy", path: "/refund" },
];

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleInternalNavigation = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    navigate(path);

    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 60);
  };

  return (
    <footer className="relative overflow-hidden border-t bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.08),transparent_28%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.08),transparent_25%)]" />

      <div className="container py-14 sm:py-16">
        <div className="mb-10 rounded-[28px] border bg-card/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
            <div className="space-y-5">
              <button
                type="button"
                onClick={() => handleInternalNavigation("/")}
                className="inline-flex items-center gap-3 font-display text-left text-xl font-bold text-primary"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-primary/10">
                  <GraduationCap className="h-6 w-6" />
                </span>
                <span>Coursify</span>
              </button>

              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Learn smarter. Build faster.
              </div>

              <p className="max-w-md text-sm leading-7 text-muted-foreground">
                Empowering learners with high-quality courses, practical skills,
                AI-powered learning support, and a cleaner path to real growth.
              </p>

              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ icon: Icon, url, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-background text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground hover:shadow-md"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground/90">
                Quick Links
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      type="button"
                      onClick={() => handleInternalNavigation(link.path)}
                      className="group inline-flex items-center gap-2 text-left transition-colors hover:text-foreground"
                    >
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 ml-6 text-sm font-semibold uppercase tracking-wide text-foreground/90">
                Support
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      type="button"
                      onClick={() => handleInternalNavigation(link.path)}
                      className="group inline-flex items-center gap-2 text-left transition-colors hover:text-foreground"
                    >
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground/90">
                Contact
              </h4>

              <div className="space-y-4 text-sm text-muted-foreground">
                <a
                  href="mailto:supportCoursify@gmail.com"
                  className="flex items-start gap-3 rounded-2xl border bg-background/70 p-3 transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="break-all">supportcoursify655@gmail.com</span>
                </a>

                <a
                  href="tel:+916397426613"
                  className="flex items-start gap-3 rounded-2xl border bg-background/70 p-3 transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>+91 6397426613</span>
                </a>

                <div className="flex items-start gap-3 rounded-2xl border bg-background/70 p-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>Mathura, UP, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t pt-6">
            <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
              <p>© {new Date().getFullYear()} Coursify. All rights reserved.</p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleInternalNavigation("/privacy")}
                  className="transition-colors hover:text-foreground"
                >
                  Privacy
                </button>

                <button
                  type="button"
                  onClick={() => handleInternalNavigation("/terms")}
                  className="transition-colors hover:text-foreground"
                >
                  Terms
                </button>

                <button
                  type="button"
                  onClick={() => handleInternalNavigation("/contact")}
                  className="transition-colors hover:text-foreground"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;