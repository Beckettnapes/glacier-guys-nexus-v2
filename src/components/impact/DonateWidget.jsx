import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DonateWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="lg:sticky lg:top-28 w-full">
      
      <div className="rounded-2xl overflow-hidden glow-orange">
        <div className="bg-gradient-to-br from-accent/90 to-accent p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <h3 className="text-white text-2xl font-bold mb-3">
            Make an Impact
          </h3>
          <p className="text-white/80 text-sm leading-relaxed mb-8">
            Every contribution fuels our expeditions, 
            funds research, and protects the world's 
            most vulnerable glaciers.
          </p>
          <Button
            size="lg"
            className="w-full bg-white text-accent hover:bg-white/90 font-bold text-base py-6 rounded-xl"
            onClick={() => window.open("https://www.gofundme.com/f/support-glacier-guys-combat-arctic-climate-change", "_blank")}>
            
            Donate Now
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-white/50 text-xs mt-4">
            100% of donations go directly to our missions
          </p>
        </div>
      </div>

    </motion.div>);

}