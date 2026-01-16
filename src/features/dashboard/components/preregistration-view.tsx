"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LAUNCH_DATE } from "@/constants/platform";
import { LucideIcon, Sparkles, Rocket, CheckCircle2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";

export function PreregistrationView() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = LAUNCH_DATE.getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-12 max-w-5xl mx-auto w-full">
            <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20 bg-primary/5 mb-4">
                    <Sparkles className="h-3.5 w-3.5 mr-2" />
                    Early Access Confirmed
                </Badge>
                <Typography variant="h1" className="md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
                    Prepare for Liftoff
                </Typography>
                <Typography variant="lead" className="max-w-2xl mx-auto">
                    Thank you for preregistering. Your organization is all set.
                    We're putting the finishing touches on the platform.
                </Typography>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                <TimerCard label="Days" value={timeLeft.days} />
                <TimerCard label="Hours" value={timeLeft.hours} />
                <TimerCard label="Minutes" value={timeLeft.minutes} />
                <TimerCard label="Seconds" value={timeLeft.seconds} />
            </div>

            <div className="grid md:grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                <FeatureCard
                    icon={Rocket}
                    title="Launch Day Ready"
                    description="You'll be the first to know when we go live. Instant access guaranteed."
                />
                <FeatureCard
                    icon={Star}
                    title="Priority Support"
                    description="As an early adopter, you get direct access to our founding team."
                />
                <FeatureCard
                    icon={CheckCircle2}
                    title="Reserved Handle"
                    description="Your organization handle is officially reserved and locked."
                />
            </div>
        </div>
    );
}

function TimerCard({ label, value }: { label: string; value: number }) {
    return (
        <Card className="bg-card/30 backdrop-blur-sm border-border/50 shadow-xl">
            <CardContent className="p-6 text-center">
                <div className="text-4xl md:text-5xl font-mono text-primary mb-1">
                    {String(value).padStart(2, '0')}
                </div>
                <div className="text-xs text-muted-foreground">
                    {label}
                </div>
            </CardContent>
        </Card>
    );
}

function FeatureCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
    return (
        <Card className="bg-card/20 border-border/40 hover:border-primary/30 transition-colors group">
            <CardContent className="p-6 space-y-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                    <Typography variant="large" as="h3" className="font-bold">{title}</Typography>
                    <Typography variant="small" as="p" className="text-muted-foreground leading-relaxed">
                        {description}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
}
