              <motion.img
                src={airplaneImg}
                alt="Airplane"
                initial={{ offsetDistance: "0%", opacity: 1 }}
                animate={{
                  offsetDistance: "100%",
                  opacity: 1,
                  rotate: [-40, -20, 0, 20, 40]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "easeInOut",
                  repeatDelay: 0.8
                }}
                className="w-16 h-auto object-contain filter brightness-0 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] z-30"
                style={{ 
                  offsetPath: "path('M 0 100 Q 400 -180 800 100')",
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
