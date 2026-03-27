import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Star,
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  BadgeCheck,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "10K+", label: "Courses", icon: BookOpen },
  { value: "50K+", label: "Students", icon: Users },
  { value: "200+", label: "Instructors", icon: GraduationCap },
];

const HeroSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY || 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const imageTranslateY = Math.min(scrollY * 0.08, 30);
  const cardTranslateY = Math.min(scrollY * 0.04, 18);

  return (
    <section className="hero-shell relative overflow-hidden bg-background py-20 lg:py-28 xl:py-32">
      <style>
        {`
          @keyframes gradientFlow {
            0% {
              background-position: 0% 50%;
            }
            25% {
              background-position: 35% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            75% {
              background-position: 65% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          @keyframes floatY {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(0, -14px, 0) scale(1.03);
            }
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
          }

          @keyframes floatYReverse {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(0, 12px, 0) scale(0.98);
            }
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
          }

          @keyframes softPulse {
            0% {
              opacity: 0.34;
            }
            50% {
              opacity: 0.6;
            }
            100% {
              opacity: 0.34;
            }
          }

          @keyframes cardFloat {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          .hero-shell {
            position: relative;
            isolation: isolate;
          }

          .hero-shell::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle at 14% 24%, rgba(79, 70, 229, 0.16), transparent 28%),
              radial-gradient(circle at 85% 18%, rgba(236, 72, 153, 0.14), transparent 30%),
              radial-gradient(circle at 52% 82%, rgba(168, 85, 247, 0.12), transparent 34%);
            z-index: -2;
            pointer-events: none;
          }

          .hero-shell::after {
            content: "";
            position: absolute;
            inset: 0;
            background-image:
              linear-gradient(to right, hsl(var(--border) / 0.06) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border) / 0.06) 1px, transparent 1px);
            background-size: 44px 44px;
            mask-image: radial-gradient(circle at center, black 42%, transparent 88%);
            z-index: -1;
            pointer-events: none;
          }

          .hero-title {
            font-family: "Space Grotesk", "Inter", sans-serif;
            font-size: clamp(3.6rem, 8vw, 8rem);
            line-height: 0.88;
            letter-spacing: -0.045em;
            font-weight: 900;
            text-wrap: balance;
            text-rendering: optimizeLegibility;
            max-width: 7.2ch;
          }

          .hero-title-line {
            display: block;
            white-space: nowrap;
          }

          .hero-title-solid {
            display: inline-block;
            color: hsl(var(--foreground));
            text-shadow:
              0 0 0.01px currentColor,
              0 0 0.01px currentColor,
              0.6px 0 0 currentColor,
              -0.6px 0 0 currentColor;
          }

          .hero-gradient-text {
            display: inline-block;
            background-image: linear-gradient(
              135deg,
              #4f46e5 0%,
              #7c3aed 20%,
              #d946ef 44%,
              #f43f5e 68%,
              #8b5cf6 86%,
              #4f46e5 100%
            );
            background-size: 220% 220%;
            background-position: 0% 50%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: gradientFlow 6.5s ease-in-out infinite;
            filter: saturate(1.08);
            text-shadow: none;
            padding-right: 0.04em;
          }

          .hero-gradient-btn {
            position: relative;
            overflow: hidden;
            color: white !important;
            border: none;
            background: linear-gradient(
              135deg,
              #4f46e5 0%,
              #7c3aed 22%,
              #d946ef 45%,
              #f43f5e 68%,
              #8b5cf6 84%,
              #4f46e5 100%
            );
            background-size: 260% 260%;
            background-position: 0% 50%;
            animation: gradientFlow 12s ease-in-out infinite;
            will-change: background-position, filter;
            transform: translateZ(0);
            backface-visibility: hidden;
          }

          .hero-gradient-btn:hover {
            filter: brightness(1.04);
          }

          .hero-gradient-btn::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              115deg,
              rgba(255, 255, 255, 0.18) 0%,
              rgba(255, 255, 255, 0.06) 22%,
              rgba(255, 255, 255, 0) 45%,
              rgba(255, 255, 255, 0.10) 70%,
              rgba(255, 255, 255, 0.04) 100%
            );
            background-size: 220% 220%;
            background-position: 0% 50%;
            animation: gradientFlow 12s ease-in-out infinite;
            pointer-events: none;
          }

          .hero-gradient-btn > * {
            position: relative;
            z-index: 1;
          }

          .hero-subtext {
            max-width: 42rem;
            font-size: 1.08rem;
            line-height: 1.9;
            color: hsl(var(--muted-foreground));
          }

          .hero-badge {
            border: 1px solid hsl(var(--border) / 0.7);
            background: hsl(var(--background) / 0.72);
            backdrop-filter: blur(16px);
            box-shadow: 0 10px 30px -18px rgba(0, 0, 0, 0.35);
          }

          .hero-ambient-1,
          .hero-ambient-2,
          .hero-ambient-3 {
            border-radius: 9999px;
            filter: blur(60px);
            will-change: transform, opacity;
            pointer-events: none;
          }

          .hero-ambient-1 {
            background: rgba(79, 70, 229, 0.22);
            animation: floatY 9s ease-in-out infinite, softPulse 9s ease-in-out infinite;
          }

          .hero-ambient-2 {
            background: rgba(236, 72, 153, 0.18);
            animation: floatYReverse 11s ease-in-out infinite, softPulse 11s ease-in-out infinite;
          }

          .hero-ambient-3 {
            background: rgba(168, 85, 247, 0.18);
            animation: floatY 13s ease-in-out infinite, softPulse 13s ease-in-out infinite;
          }

          .hero-stat-card {
            border: 1px solid hsl(var(--border) / 0.75);
            background: hsl(var(--background) / 0.78);
            backdrop-filter: blur(14px);
            box-shadow: 0 16px 35px -24px rgba(0, 0, 0, 0.25);
            transition:
              transform 180ms ease,
              box-shadow 180ms ease,
              border-color 180ms ease;
          }

          .hero-stat-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 40px -24px rgba(0, 0, 0, 0.3);
            border-color: hsl(var(--primary) / 0.24);
          }

          .hero-media-shell {
            position: relative;
            min-height: 580px;
          }

          .hero-main-card {
            position: relative;
            margin-inline: auto;
            width: 100%;
            max-width: 590px;
            overflow: hidden;
            border-radius: 34px;
            border: 1px solid hsl(var(--border) / 0.7);
            background: hsl(var(--card));
            box-shadow:
              0 38px 90px -46px rgba(0, 0, 0, 0.42),
              0 20px 50px -40px rgba(99, 102, 241, 0.28);
          }

          .hero-main-card::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
              linear-gradient(to top, rgba(2, 6, 23, 0.10), transparent 30%),
              linear-gradient(to bottom right, rgba(255, 255, 255, 0.06), transparent 32%);
            z-index: 1;
            pointer-events: none;
          }

          .hero-main-image {
            display: block;
            width: 100%;
            height: 580px;
            object-fit: cover;
            object-position: center;
          }

          .hero-floating-card {
            position: absolute;
            border-radius: 22px;
            border: 1px solid hsl(var(--border) / 0.78);
            background: hsl(var(--card) / 0.9);
            backdrop-filter: blur(14px);
            box-shadow: 0 20px 45px -28px rgba(0, 0, 0, 0.3);
            animation: cardFloat 5.4s ease-in-out infinite;
          }

          .hero-floating-card.secondary {
            animation-duration: 6.6s;
          }

          .hero-pill {
            border: 1px solid hsl(var(--border) / 0.7);
            background: hsl(var(--background) / 0.76);
            backdrop-filter: blur(12px);
          }

          @media (max-width: 640px) {
            .hero-title {
              font-size: clamp(2.9rem, 12vw, 4.4rem);
              line-height: 0.9;
              letter-spacing: -0.05em;
              max-width: none;
            }

            .hero-title-line {
              white-space: normal;
            }
          }
        `}
      </style>

      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-ambient-1 absolute -left-24 top-24 h-72 w-72" />
        <div className="hero-ambient-2 absolute right-[-4rem] top-[-2rem] h-80 w-80" />
        <div className="hero-ambient-3 absolute bottom-[-6rem] left-1/2 h-96 w-96 -translate-x-1/2" />
      </div>

      <div className="container relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="hero-badge inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Over 10,000+ courses available
            </div>

            <div className="space-y-5">
              <h1 className="hero-title text-foreground">
                <span className="hero-title-line hero-title-solid">
                  Learn Without
                </span>
                <span className="hero-title-line">
                  <span className="hero-gradient-text">Limits</span>
                </span>
              </h1>

              <p className="hero-subtext">
                Build real skills with expert-led courses across coding, design,
                business, AI, and more. Learn at your own pace, sharpen what
                matters, and turn effort into real progress.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                asChild
                className="hero-gradient-btn group h-12 gap-2 rounded-xl px-6 text-sm font-semibold shadow-md transition-all hover:scale-[1.03]"
              >
                <Link to="/courses">
                  Explore Courses
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-xl px-6 text-sm font-semibold"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span>
                  <span className="font-semibold text-foreground">4.9/5</span>{" "}
                  average learner rating
                </span>
              </div>

              <div className="hidden h-4 w-px bg-border sm:block" />

              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                <span>Flexible, self-paced learning</span>
              </div>
            </div>

            <div className="grid max-w-2xl gap-4 pt-3 sm:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div key={stat.label} className="hero-stat-card rounded-2xl p-4">
                    <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-2xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="hero-media-shell">
              <div
                className="hero-main-card"
                style={{
                  transform: `translateY(${imageTranslateY}px)`,
                  transition: "transform 180ms ease-out",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                  alt="Students learning together"
                  className="hero-main-image"
                />
              </div>

              <div
                className="hero-floating-card secondary bottom-8 left-5 z-20 max-w-[280px] p-4"
                style={{
                  transform: `translateY(${cardTranslateY * 0.7}px)`,
                  transition: "transform 180ms ease-out",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-green-500/10 p-2 text-green-600">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Career-focused outcomes
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Practical skills, guided projects, and real progress you can measure.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="hero-pill absolute bottom-6 right-5 z-20 rounded-full px-4 py-2 text-sm text-muted-foreground"
                style={{
                  transform: `translateY(${-cardTranslateY * 0.6}px)`,
                  transition: "transform 180ms ease-out",
                }}
              >
                50K+ active learners
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                  alt="Students learning together"
                  className="block h-[320px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Start learning today
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Discover practical courses built for real progress.
                    </p>
                  </div>

                  <Link
                    to="/courses"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:scale-105 hover:shadow-md"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                  4.9 average learner rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;