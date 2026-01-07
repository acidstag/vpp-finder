'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Battery,
  MapPin,
  Sun,
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles
} from 'lucide-react'

// Battery brand options with display names
const BATTERY_BRANDS = [
  { id: 'tesla-powerwall', name: 'Tesla Powerwall' },
  { id: 'lg-chem', name: 'LG Chem' },
  { id: 'sonnen', name: 'Sonnen' },
  { id: 'sungrow', name: 'Sungrow' },
  { id: 'byd', name: 'BYD' },
  { id: 'enphase', name: 'Enphase' },
  { id: 'alpha-ess', name: 'Alpha ESS' },
  { id: 'redback', name: 'Redback' },
  { id: 'goodwe', name: 'GoodWe' },
  { id: 'other', name: 'Other Brand' },
]

const SOLAR_OPTIONS = [
  { id: 'none', label: 'No Solar', value: 0, description: 'Battery only' },
  { id: 'small', label: '3-5 kW', value: 4, description: 'Small system' },
  { id: 'medium', label: '6-8 kW', value: 6.6, description: 'Most common' },
  { id: 'large', label: '9-13 kW', value: 10, description: 'Large system' },
  { id: 'xlarge', label: '13+ kW', value: 15, description: 'Commercial size' },
]

const RETAILER_OPTIONS = [
  {
    id: 'open',
    title: 'Open to Switching',
    description: 'Show me the best deals, even if I need to change retailers',
    icon: Zap,
    highlight: 'Highest earnings'
  },
  {
    id: 'keep',
    title: 'Keep My Retailer',
    description: "I want to stay with my current electricity provider",
    icon: Check,
    highlight: 'More flexibility'
  },
  {
    id: 'advice',
    title: 'Need Advice',
    description: "Show me both options and help me decide what's best",
    icon: Sparkles,
    highlight: 'Recommended'
  },
]

const STEPS = [
  { id: 'battery', title: 'Battery', icon: Battery },
  { id: 'location', title: 'Location', icon: MapPin },
  { id: 'solar', title: 'Solar', icon: Sun },
  { id: 'preference', title: 'Preference', icon: Zap },
]

export default function CalculatorPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState({
    battery: '',
    postcode: '',
    solar: null as number | null,
    preference: '' as 'open' | 'keep' | 'advice' | ''
  })
  const [postcodeError, setPostcodeError] = useState('')

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.battery !== ''
      case 1: return formData.postcode.length === 4 && !postcodeError
      case 2: return formData.solar !== null
      case 3: return formData.preference !== ''
      default: return false
    }
  }

  const validatePostcode = (value: string) => {
    if (value.length === 0) {
      setPostcodeError('')
      return
    }
    if (!/^\d+$/.test(value)) {
      setPostcodeError('Numbers only')
      return
    }
    if (value.length === 4) {
      const code = parseInt(value)
      if (code < 200 || code > 9999) {
        setPostcodeError('Invalid Australian postcode')
      } else {
        setPostcodeError('')
      }
    } else if (value.length > 4) {
      setPostcodeError('Postcode must be 4 digits')
    } else {
      setPostcodeError('')
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1)
      setCurrentStep(prev => prev + 1)
    } else {
      // Submit - navigate to results
      const params = new URLSearchParams({
        battery: formData.battery,
        location: formData.postcode,
        solar: formData.solar?.toString() || '0',
        preference: formData.preference,
        source: 'calculator',
      })
      router.push(`/results?${params.toString()}`)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(prev => prev - 1)
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-xl">VPP Calculator</h1>
              <p className="text-sm text-muted-foreground">Find your perfect program in 60 seconds</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-accent">
                {currentStep + 1}/{STEPS.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex">
            {STEPS.map((step, idx) => {
              const Icon = step.icon
              const isActive = idx === currentStep
              const isComplete = idx < currentStep

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    if (idx < currentStep) {
                      setDirection(-1)
                      setCurrentStep(idx)
                    }
                  }}
                  disabled={idx > currentStep}
                  className={`
                    flex-1 py-4 flex items-center justify-center gap-2 border-b-2 transition-all duration-300
                    ${isActive ? 'border-accent text-accent' : ''}
                    ${isComplete ? 'border-accent/50 text-accent/70 cursor-pointer hover:text-accent' : ''}
                    ${!isActive && !isComplete ? 'border-transparent text-muted-foreground' : ''}
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                    ${isActive ? 'bg-accent text-accent-foreground' : ''}
                    ${isComplete ? 'bg-accent/20 text-accent' : ''}
                    ${!isActive && !isComplete ? 'bg-muted text-muted-foreground' : ''}
                  `}>
                    {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="hidden sm:inline font-medium">{step.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Step 1: Battery Selection */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="font-display font-bold text-3xl">What battery do you have?</h2>
                    <p className="text-muted-foreground">Select your battery brand to find compatible VPP programs</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {BATTERY_BRANDS.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => setFormData(prev => ({ ...prev, battery: brand.name }))}
                        className={`
                          relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                          hover:border-accent/50 hover:bg-accent/5
                          ${formData.battery === brand.name
                            ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10'
                            : 'border-border bg-card'
                          }
                        `}
                      >
                        <div className={`w-8 h-8 mb-2 rounded-md flex items-center justify-center ${
                          formData.battery === brand.name ? 'bg-accent/20' : 'bg-muted'
                        }`}>
                          <Battery className="w-4 h-4" />
                        </div>
                        <div className="font-medium text-sm">{brand.name}</div>
                        {formData.battery === brand.name && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-accent-foreground" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="font-display font-bold text-3xl">Where are you located?</h2>
                    <p className="text-muted-foreground">VPP availability and earnings vary by region</p>
                  </div>

                  <Card className="p-8">
                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-sm font-medium text-muted-foreground">Australian Postcode</span>
                        <div className="relative mt-2">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            value={formData.postcode}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                              setFormData(prev => ({ ...prev, postcode: value }))
                              validatePostcode(value)
                            }}
                            placeholder="2000"
                            className={`
                              w-full pl-12 pr-4 py-4 text-2xl font-mono font-bold text-center
                              border-2 rounded-xl bg-background transition-all duration-200
                              focus:outline-none focus:ring-0
                              ${postcodeError
                                ? 'border-destructive focus:border-destructive'
                                : formData.postcode.length === 4
                                  ? 'border-accent focus:border-accent'
                                  : 'border-border focus:border-accent'
                              }
                            `}
                            autoFocus
                          />
                        </div>
                        {postcodeError && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-destructive"
                          >
                            {postcodeError}
                          </motion.p>
                        )}
                      </label>

                      {formData.postcode.length === 4 && !postcodeError && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-accent"
                        >
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Valid postcode</span>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* Step 3: Solar System */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="font-display font-bold text-3xl">Do you have solar panels?</h2>
                    <p className="text-muted-foreground">Solar helps charge your battery for VPP exports</p>
                  </div>

                  <div className="space-y-3">
                    {SOLAR_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setFormData(prev => ({ ...prev, solar: option.value }))}
                        className={`
                          w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                          flex items-center justify-between
                          hover:border-accent/50 hover:bg-accent/5
                          ${formData.solar === option.value
                            ? 'border-accent bg-accent/10'
                            : 'border-border bg-card'
                          }
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`
                            w-12 h-12 rounded-lg flex items-center justify-center
                            ${formData.solar === option.value ? 'bg-accent text-accent-foreground' : 'bg-muted'}
                          `}>
                            <Sun className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-semibold">{option.label}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                        </div>
                        {formData.solar === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-accent-foreground" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Retailer Preference */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="font-display font-bold text-3xl">Retailer preference?</h2>
                    <p className="text-muted-foreground">Some VPPs require switching electricity providers</p>
                  </div>

                  <div className="space-y-3">
                    {RETAILER_OPTIONS.map((option) => {
                      const Icon = option.icon
                      return (
                        <button
                          key={option.id}
                          onClick={() => setFormData(prev => ({ ...prev, preference: option.id as 'open' | 'keep' | 'advice' }))}
                          className={`
                            w-full p-5 rounded-xl border-2 transition-all duration-200 text-left
                            hover:border-accent/50 hover:bg-accent/5
                            ${formData.preference === option.id
                              ? 'border-accent bg-accent/10'
                              : 'border-border bg-card'
                            }
                          `}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`
                              w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                              ${formData.preference === option.id ? 'bg-accent text-accent-foreground' : 'bg-muted'}
                            `}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{option.title}</span>
                                {option.id === 'advice' && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
                                    {option.highlight}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                            </div>
                            {formData.preference === option.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0"
                              >
                                <Check className="w-4 h-4 text-accent-foreground" />
                              </motion.div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              size="lg"
              className="gap-2 min-w-[160px]"
            >
              {currentStep === STEPS.length - 1 ? (
                <>
                  See My Results
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Summary Preview */}
          {(formData.battery || formData.postcode || formData.solar !== null) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 rounded-xl bg-muted/50 border border-border"
            >
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Your Setup
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.battery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                    <Battery className="w-3 h-3" />
                    {formData.battery}
                  </span>
                )}
                {formData.postcode && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                    <MapPin className="w-3 h-3" />
                    {formData.postcode}
                  </span>
                )}
                {formData.solar !== null && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                    <Sun className="w-3 h-3" />
                    {formData.solar === 0 ? 'No solar' : `${formData.solar}kW`}
                  </span>
                )}
                {formData.preference && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                    <Zap className="w-3 h-3" />
                    {formData.preference === 'open' ? 'Open to switch' : formData.preference === 'keep' ? 'Keep retailer' : 'Need advice'}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
