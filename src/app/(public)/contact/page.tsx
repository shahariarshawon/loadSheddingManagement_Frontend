"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  AlertTriangle,
  Radio,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(5, "Subject must be at least 5 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate inquiry submission to utility support desk
    await new Promise((res) => setTimeout(res, 800));
    setIsSubmitting(false);
    toast.success("Support Inquiry Dispatched!", {
      description: `Thank you, ${data.name}. Our regional power dispatch team has received your ticket.`,
    });
    reset();
  };

  return (
    <div className="flex flex-col min-h-screen py-10 sm:py-16 space-y-12">
      {/* Header */}
      <section className="container mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-3">
        <Badge variant="outline" className="text-xs uppercase font-mono px-3 py-1 border-primary/30 text-primary">
          Support & Emergency Dispatch
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Contact & Utility Operations
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Need assistance or urgent transformer hazard reporting? Connect directly with your regional distribution dispatch station.
        </p>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emergency Hotlines Directory */}
          <div className="space-y-6">
            <Card className="border-destructive/30 bg-destructive/5 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <CardTitle className="text-base font-bold">24/7 Grid Emergency Hotlines</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Immediate dispatch lines for live wire fall, sparking transformers, or fire hazards.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-xs">
                <div className="p-3 rounded-lg bg-background/80 border border-border flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-foreground">National Grid Emergency</span>
                    <span className="text-[11px] text-muted-foreground">Toll-free 24/7 priority line</span>
                  </div>
                  <span className="font-mono font-bold text-destructive text-sm">16120</span>
                </div>

                <div className="p-3 rounded-lg bg-background/80 border border-border flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-foreground">Dhaka North Control Center</span>
                    <span className="text-[11px] text-muted-foreground">Gulshan, Banani, Uttara</span>
                  </div>
                  <span className="font-mono font-semibold text-foreground text-xs">+880 2 8901234</span>
                </div>

                <div className="p-3 rounded-lg bg-background/80 border border-border flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-foreground">Dhaka South Control Center</span>
                    <span className="text-[11px] text-muted-foreground">Dhanmondi, Motijheel, Old Town</span>
                  </div>
                  <span className="font-mono font-semibold text-foreground text-xs">+880 2 8905678</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">General Operations Desk</CardTitle>
                <CardDescription className="text-xs">
                  Official correspondence and billing queries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>dispatch@gridwatch.com</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="h-4 w-4 text-primary" />
                  <span>+880 1700 000000 (09:00 - 18:00)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>GridWatch Central Command, Gulshan-2, Dhaka 1212</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>System Telemetry: 24/7 Active Monitoring</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-2">
            <Card className="border-border bg-card p-6 sm:p-8">
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-primary" />
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    Send Operations Inquiry
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Have questions about scheduled outages, area coverage, or power utility integration? Fill out the form below.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      className="text-xs"
                      disabled={isSubmitting}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="citizen@example.com"
                      className="text-xs"
                      disabled={isSubmitting}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold">
                      Phone Number (Optional)
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+880 1..."
                      className="text-xs"
                      disabled={isSubmitting}
                      {...register("phone")}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="subject" className="text-xs font-semibold">
                      Inquiry Subject *
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Load-shedding schedule inquiry"
                      className="text-xs"
                      disabled={isSubmitting}
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="text-[11px] text-destructive">{errors.subject.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs font-semibold">
                    Message *
                  </Label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Describe your inquiry or question in detail..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-destructive">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="font-medium text-xs h-9 cursor-pointer shadow-xs gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Dispatching Ticket...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Send Inquiry
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
