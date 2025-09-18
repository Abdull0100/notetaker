  <script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import Navbar from "$lib/components/navbar/navbar.svelte";
    import { Mic, Link, Brain, Linkedin, Twitter, Youtube, Github } from "lucide-svelte";
    // Assuming Card is still used elsewhere or you might remove it entirely if not needed.
    // import * as Card from "$lib/components/ui/card/index.js";
  </script>

<Navbar />

<div class="min-h-screen bg-gradient-to-br from-background to-muted/20 relative overflow-hidden">
  <!-- Gradient Blob for visual interest (optional, requires more CSS or a library) -->
  <!-- <div class="absolute top-0 -left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
  <div class="absolute bottom-1/4 -right-1/4 w-80 h-80 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div> -->

  <!-- Hero Section -->
  <div class="container mx-auto px-4 py-20 text-center relative z-10">
    <div class="max-w-4xl mx-auto space-y-8 mb-20">
      <div class="animate-fade-in">
        <h1 class="text-6xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent leading-tight">
          Neutron Notetaker
        </h1>
        <p class="text-2xl text-foreground/70 mt-4 font-medium">
          Your AI-Powered Meeting Assistant <br class="md:hidden"/> for Immutable Knowledge.
        </p>
      </div>
      
      <div class="animate-slide-up max-w-3xl mx-auto text-lg leading-relaxed text-foreground/80">
        <p>
          Transform how you manage information. Neutron Notetaker intelligently transcribes, summarizes, and generates action items from your meetings, all secured with <span class="font-semibold text-primary">blockchain-powered Seeds</span> for verifiable and immutable knowledge.
        </p>
        <p class="mt-3">
          Experience truly private local processing and unparalleled cross-meeting context awareness, ensuring you never miss a detail.
        </p>
      </div>

      <!-- Central Call to Action (Improved "Get Started Today") -->
      <div class="mt-12 animate-fade-in-delayed-4">
        <Button size="lg" class="px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform duration-300" onclick={() => window.location.href = '/signup'}>
          Start Free Trial
        </Button>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid md:grid-cols-3 gap-8 mb-16">
       <div class="animate-fade-in-delayed-1 bg-card/60 backdrop-blur-md p-8 rounded-xl border border-border/70 shadow-lg hover:shadow-xl transition-shadow duration-300">
         <div class="flex items-center mb-3">
           <Mic class="h-6 w-6 text-primary mr-3" />
           <h3 class="font-bold text-xl text-primary">Smart Transcription</h3>
         </div>
         <p class="text-base text-muted-foreground">Local audio processing with Whisper Small for privacy-first, accurate transcription of all your meetings.</p>
       </div>
       <div class="animate-fade-in-delayed-2 bg-card/60 backdrop-blur-md p-8 rounded-xl border border-border/70 shadow-lg hover:shadow-xl transition-shadow duration-300">
         <div class="flex items-center mb-3">
           <Link class="h-6 w-6 text-primary mr-3" />
           <h3 class="font-bold text-xl text-primary">Immutable Seeds</h3>
         </div>
         <p class="text-base text-muted-foreground">Verifiable, on-chain records of organizational knowledge, ensuring auditability and a single source of truth.</p>
       </div>
       <div class="animate-fade-in-delayed-3 bg-card/60 backdrop-blur-md p-8 rounded-xl border border-border/70 shadow-lg hover:shadow-xl transition-shadow duration-300">
         <div class="flex items-center mb-3">
           <Brain class="h-6 w-6 text-primary mr-3" />
           <h3 class="font-bold text-xl text-primary">Context Awareness</h3>
         </div>
         <p class="text-base text-muted-foreground">Advanced AI reasoning across multiple meetings, providing deep insights and intelligent pre-meeting context.</p>
       </div>
    </div>
  </div>
</div>

<footer class="bg-black text-white py-12">
  <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
     <!-- Logo and Brand Name -->
     <div class="md:col-span-2 flex items-center space-x-3 mb-8 md:mb-0">
       <Brain class="h-10 w-10 text-primary" />
       <span class="text-2xl font-bold">Neutron Notetaker</span>
     </div>

    <!-- Product Links -->
    <div>
      <h4 class="font-semibold text-lg mb-4 text-primary">Product</h4>
      <ul class="space-y-2">
        <li><a href="/features" class="text-muted-foreground hover:text-white transition-colors duration-200">Features</a></li>
        <li><a href="/recaps" class="text-muted-foreground hover:text-white transition-colors duration-200">Recaps</a></li>
        <li><a href="/education-agent" class="text-muted-foreground hover:text-white transition-colors duration-200">Education Agent</a></li>
        <li><a href="/media-agent" class="text-muted-foreground hover:text-white transition-colors duration-200">Media Agent</a></li>
      </ul>
    </div>

    <!-- Company Links -->
    <div>
      <h4 class="font-semibold text-lg mb-4 text-primary">Company</h4>
      <ul class="space-y-2">
        <li><a href="/about" class="text-muted-foreground hover:text-white transition-colors duration-200">About Us</a></li>
        <li><a href="/careers" class="text-muted-foreground hover:text-white transition-colors duration-200">Careers</a></li>
        <li><a href="/press" class="text-muted-foreground hover:text-white transition-colors duration-200">Press</a></li>
      </ul>
    </div>

    <!-- Resources & Legal -->
    <div>
      <h4 class="font-semibold text-lg mb-4 text-primary">Resources</h4>
      <ul class="space-y-2">
        <li><a href="/careers" class="text-muted-foreground hover:text-white transition-colors duration-200">Careers</a></li>
        <li><a href="/blog" class="text-muted-foreground hover:text-white transition-colors duration-200">Blog</a></li>
        <li><a href="/integrations" class="text-muted-foreground hover:text-white transition-colors duration-200">Integrations</a></li>
      </ul>
      <h4 class="font-semibold text-lg mt-6 mb-4 text-primary">Legal</h4>
      <ul class="space-y-2">
        <li><a href="/privacy-policy" class="text-muted-foreground hover:text-white transition-colors duration-200">Privacy Policy</a></li>
        <li><a href="/terms-of-service" class="text-muted-foreground hover:text-white transition-colors duration-200">Terms of Service</a></li>
      </ul>
    </div>
  </div>

  <div class="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-muted-foreground text-sm">
    <div class="mb-4 md:mb-0">
      &copy; 2024 Neutron Notetaker Inc. All rights reserved.
    </div>
     <div class="flex space-x-6">
       <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors duration-200">
         <Linkedin class="h-5 w-5" />
       </a>
       <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors duration-200">
         <Twitter class="h-5 w-5" />
       </a>
       <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors duration-200">
         <Youtube class="h-5 w-5" />
       </a>
       <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors duration-200">
         <Github class="h-5 w-5" />
       </a>
     </div>
  </div>
</footer>

<style>
  /* Base animations */
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slide-up {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Applied animations with delays */
  .animate-fade-in {
    animation: fade-in 0.8s ease-out;
  }

  .animate-slide-up {
    animation: slide-up 1s ease-out 0.2s both;
  }

  /* Feature cards animations */
  .animate-fade-in-delayed-1 {
    animation: fade-in 0.7s ease-out 0.8s both;
  }

  .animate-fade-in-delayed-2 {
    animation: fade-in 0.7s ease-out 1.0s both;
  }

  .animate-fade-in-delayed-3 {
    animation: fade-in 0.7s ease-out 1.2s both;
  }

  /* Main CTA button animation */
  .animate-fade-in-delayed-4 {
    animation: fade-in 0.8s ease-out 0.6s both; /* Earlier animation for CTA */
  }

  /* Optional: Background gradient blob animation */
  /* @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 7s infinite cubic-bezier(0.6, 0.01, 0.4, 1);
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  } */
</style>