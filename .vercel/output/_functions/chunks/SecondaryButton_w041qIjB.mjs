import { e as createComponent, m as maybeRenderHead, l as renderScript, r as renderTemplate, f as createAstro, h as addAttribute, n as renderHead, k as renderComponent, o as renderSlot } from './astro/server_BnuYbohY.mjs';
import 'kleur/colors';
/* empty css                      */
import 'clsx';
import { useEffect, useState, useCallback, useRef } from 'react';
import Lenis from 'lenis';
/* empty css                         */
import { jsxs, jsx } from 'react/jsx-runtime';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, X, User, Mail, Phone, Globe, Heart, DollarSign, MessageSquare, Paperclip, FileText, Loader2, Send } from 'lucide-react';
import { createPortal } from 'react-dom';

const $$CustomCursor = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="custom-cursor" class="custom-cursor" data-astro-cid-rzmbrfit> <svg class="cursor-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="24" height="24" data-astro-cid-rzmbrfit> <path fill="#000000" stroke="#ffffff" stroke-width="2" d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z" data-astro-cid-rzmbrfit></path> </svg> </div>  ${renderScript($$result, "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/CustomCursor.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/CustomCursor.astro", void 0);

const $$ClickBubble = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="click-bubble" class="click-bubble" data-astro-cid-7o36or33> <div class="bubble-container" data-astro-cid-7o36or33> <div class="bubble-text" data-astro-cid-7o36or33>CLICK</div> <div class="bubble-tail" data-astro-cid-7o36or33></div> </div> </div>  ${renderScript($$result, "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/ClickBubble.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/ClickBubble.astro", void 0);

const $$ScrollIndicator = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="scroll-indicator-wrapper" data-astro-cid-2uwc22yw> <div class="scroll-indicator" data-astro-cid-2uwc22yw> <!-- Main circle container --> <div class="indicator-circle" data-astro-cid-2uwc22yw> <!-- Progress circle (SVG) --> <svg class="progress-ring" viewBox="0 0 60 60" data-astro-cid-2uwc22yw> <circle class="progress-ring-background" cx="30" cy="30" r="26" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="2" data-astro-cid-2uwc22yw></circle> <circle class="progress-ring-progress" cx="30" cy="30" r="26" fill="none" stroke="url(#progressGradient)" stroke-width="3" stroke-linecap="round" transform="rotate(-90 30 30)" data-astro-cid-2uwc22yw></circle> <!-- Gradient definition --> <defs data-astro-cid-2uwc22yw> <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%" data-astro-cid-2uwc22yw> <stop offset="0%" style="stop-color:#f8f3ff;stop-opacity:1" data-astro-cid-2uwc22yw></stop> <stop offset="50%" style="stop-color:#f2f2f2;stop-opacity:0.9" data-astro-cid-2uwc22yw></stop> <stop offset="100%" style="stop-color:#b8a3ff;stop-opacity:0.7" data-astro-cid-2uwc22yw></stop> </linearGradient> </defs> </svg> <!-- Inner content --> <div class="indicator-content" data-astro-cid-2uwc22yw> <div class="scroll-percentage" data-astro-cid-2uwc22yw>0%</div> <!-- Arrow icon for 100% --> <div class="scroll-arrow" style="display: none;" data-astro-cid-2uwc22yw> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-2uwc22yw> <path d="M18 15l-6-6-6 6" data-astro-cid-2uwc22yw></path> </svg> </div> <!-- Inner glow layer (similar to MainButton) --> <div class="indicator-inner-glow" data-astro-cid-2uwc22yw></div> </div> </div> </div> </div>  ${renderScript($$result, "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/ScrollIndicator.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/ScrollIndicator.astro", void 0);

function LenisIsland() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      // Duración suave pero responsiva
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Easing suave
      smooth: true,
      lerp: 0.07,
      // Balance óptimo entre suavidad y respuesta (0.05-0.1 recomendado)
      wheelMultiplier: 1,
      // Velocidad estándar del scroll con rueda del mouse
      touchMultiplier: 2,
      // Velocidad para dispositivos táctiles
      infinite: false,
      autoResize: true,
      // Ajuste automático en cambios de tamaño
      syncTouch: false,
      // Mejor performance en móviles
      syncTouchLerp: 0.1
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    const isLowEndDevice = navigator.hardwareConcurrency <= 2 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isLowEndDevice) {
      lenis.options.lerp = 0.1;
      lenis.options.duration = 0.8;
    }
    let resizeTimeout;
    const handleResize = () => {
      lenis.stop();
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        lenis.start();
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      lenis.destroy();
    };
  }, []);
  return null;
}

const $$Astro$2 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Karen Ortiz - Portfolio"><meta name="viewport" content="width=device-width"><!-- Favicon Configuration --><link rel="icon" type="image/x-icon" href="/favicon/favicon.ico"><link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"><link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"><link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png"><link rel="icon" type="image/png" sizes="512x512" href="/favicon/android-chrome-512x512.png"><link rel="manifest" href="/favicon/site.webmanifest"><!-- PWA Meta Tags --><meta name="theme-color" content="#4523AE"><meta name="msapplication-TileColor" content="#060314"><meta name="msapplication-config" content="/favicon/browserconfig.xml"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">${renderHead()}</head> <body> ${renderComponent($$result, "CustomCursor", $$CustomCursor, {})} ${renderComponent($$result, "ClickBubble", $$ClickBubble, {})} ${renderComponent($$result, "ScrollIndicator", $$ScrollIndicator, {})} ${renderSlot($$result, $$slots["default"])} <!-- Lenis Smooth Scroll Island - Se carga solo en el cliente para optimizar performance --> ${renderComponent($$result, "LenisIsland", LenisIsland, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/LenisIsland.jsx", "client:component-export": "default" })} </body></html>`;
}, "/Users/karenortiz/CascadeProjects/Port25Karen/src/layouts/Layout.astro", void 0);

const $$Astro$1 = createAstro();
const $$MainButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$MainButton;
  const { text = "Get my Resume", href } = Astro2.props;
  const Tag = href ? "a" : "button";
  return renderTemplate`${maybeRenderHead()}<div class="realism-button-wrapper" data-astro-cid-rjz7vswu> ${renderComponent($$result, "Tag", Tag, { "class": "realism-button group", "href": href, "data-astro-cid-rjz7vswu": true }, { "default": ($$result2) => renderTemplate`  <div class="button-glow" data-astro-cid-rjz7vswu></div>  <div class="button-blob" data-astro-cid-rjz7vswu></div>  <div class="button-content" data-astro-cid-rjz7vswu> <span class="button-text" data-astro-cid-rjz7vswu>${text}</span> <!-- Inner glow layer --> <div class="inner-glow" data-astro-cid-rjz7vswu></div> </div> ` })} </div>  ${renderScript($$result, "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/MainButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/MainButton.astro", void 0);

const Toast = ({
  id,
  type,
  message,
  onClose,
  duration = 5e3
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, onClose, duration]);
  const handleClose = () => {
    onClose(id);
  };
  const toastStyles = {
    success: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      border: "1px solid rgba(34, 197, 94, 0.2)",
      color: "#166534",
      iconColor: "#22c55e",
      shadowColor: "rgba(34, 197, 94, 0.15)"
    },
    error: {
      background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
      border: "1px solid rgba(239, 68, 68, 0.2)",
      color: "#991b1b",
      iconColor: "#ef4444",
      shadowColor: "rgba(239, 68, 68, 0.15)"
    }
  };
  const currentStyle = toastStyles[type];
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 300, scale: 0.8 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 300, scale: 0.8 },
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      },
      style: {
        background: currentStyle.background,
        border: currentStyle.border,
        color: currentStyle.color,
        boxShadow: `0 8px 32px ${currentStyle.shadowColor}, 0 4px 16px rgba(0, 0, 0, 0.1)`,
        backdropFilter: "blur(12px)",
        borderRadius: "12px",
        padding: "16px 20px",
        minWidth: "320px",
        maxWidth: "400px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        position: "relative",
        overflow: "hidden"
      },
      className: "toast-container",
      children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { width: "100%" },
            animate: { width: "0%" },
            transition: { duration: duration / 1e3, ease: "linear" },
            style: {
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "3px",
              background: currentStyle.iconColor,
              borderRadius: "0 0 12px 12px"
            }
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { flexShrink: 0 }, children: type === "success" ? /* @__PURE__ */ jsx(
          CheckCircle,
          {
            size: 24,
            style: { color: currentStyle.iconColor }
          }
        ) : /* @__PURE__ */ jsx(
          XCircle,
          {
            size: 24,
            style: { color: currentStyle.iconColor }
          }
        ) }),
        /* @__PURE__ */ jsx("div", { style: {
          flex: 1,
          fontFamily: "var(--font-primary)",
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: 1.4
        }, children: message }),
        /* @__PURE__ */ jsx(
          motion.button,
          {
            onClick: handleClose,
            whileHover: { scale: 1.1 },
            whileTap: { scale: 0.9 },
            style: {
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: currentStyle.color,
              opacity: 0.7,
              transition: "opacity 0.2s ease"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.opacity = "0.7";
              e.currentTarget.style.background = "transparent";
            },
            children: /* @__PURE__ */ jsx(X, { size: 16 })
          }
        )
      ]
    }
  );
};

const ToastContainer = ({ toasts, onRemoveToast }) => {
  const [portalElement, setPortalElement] = useState(null);
  useEffect(() => {
    let toastPortal = document.getElementById("toast-portal");
    if (!toastPortal) {
      toastPortal = document.createElement("div");
      toastPortal.id = "toast-portal";
      toastPortal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-end;
        padding: 20px;
        gap: 12px;
      `;
      document.body.appendChild(toastPortal);
    }
    setPortalElement(toastPortal);
    return () => {
      if (toasts.length === 0 && toastPortal && toastPortal.parentNode) {
        toastPortal.parentNode.removeChild(toastPortal);
      }
    };
  }, [toasts.length]);
  if (!portalElement) return null;
  return createPortal(
    /* @__PURE__ */ jsx("div", { style: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      zIndex: 9999,
      pointerEvents: "auto"
    }, children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "popLayout", children: toasts.map((toast) => /* @__PURE__ */ jsx(
      Toast,
      {
        id: toast.id,
        type: toast.type,
        message: toast.message,
        duration: toast.duration,
        onClose: onRemoveToast
      },
      toast.id
    )) }) }),
    portalElement
  );
};
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = {
      ...toast,
      id,
      duration: toast.duration || 5e3
    };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  const showSuccess = useCallback((message, duration) => {
    return addToast({ type: "success", message, duration });
  }, [addToast]);
  const showError = useCallback((message, duration) => {
    return addToast({ type: "error", message, duration });
  }, [addToast]);
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);
  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    clearAllToasts,
    ToastContainer: () => /* @__PURE__ */ jsx(ToastContainer, { toasts, onRemoveToast: removeToast })
  };
};

const transforms = [
  { x: -0.2, y: -0.15, rotationZ: -8 },
  { x: -0.05, y: -0.1, rotationZ: -2 },
  { x: -0.01, y: 0.025, rotationZ: 3 },
  { x: -0.01, y: -0.025, rotationZ: -2 },
  { x: -0.025, y: 0.14, rotationZ: 1 },
  { x: 0, y: -0.025, rotationZ: 2 },
  { x: 0, y: 0.04, rotationZ: -3 },
  { x: 0, y: 0.04, rotationZ: -4 },
  { x: 0, y: -0.16, rotationZ: 2 },
  { x: 0.025, y: 0.1, rotationZ: 3 },
  { x: 0, y: -0.04, rotationZ: -2 },
  { x: 0.05, y: 0.04, rotationZ: 3 },
  { x: 0.2, y: 0.15, rotationZ: 5 }
];
function TextDisperse({
  text,
  children,
  onHover,
  className,
  ...props
}) {
  const [isAnimated, setIsAnimated] = useState(false);
  const extractTextFromChildren = (children2) => {
    if (typeof children2 === "string") {
      return children2;
    }
    if (Array.isArray(children2)) {
      return children2.map((child) => extractTextFromChildren(child)).join("");
    }
    if (children2 && typeof children2 === "object") {
      if (children2.props && children2.props.children) {
        return extractTextFromChildren(children2.props.children);
      }
      if (children2.type === "text" && children2.value) {
        return children2.value;
      }
    }
    return "";
  };
  const splitWord = (word) => {
    let chars = [];
    word.split("").forEach((char, i) => {
      const transformIndex = i % transforms.length;
      chars.push(
        /* @__PURE__ */ jsx(
          motion.span,
          {
            custom: i,
            variants: {
              open: (i2) => ({
                x: transforms[transformIndex].x + "em",
                y: transforms[transformIndex].y + "em",
                rotateZ: transforms[transformIndex].rotationZ,
                transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
                zIndex: 1
              }),
              closed: {
                x: 0,
                y: 0,
                rotateZ: 0,
                transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
                zIndex: 0
              }
            },
            animate: isAnimated ? "open" : "closed",
            className: "inline-block",
            children: char
          },
          char + i
        )
      );
    });
    return chars;
  };
  const manageMouseEnter = () => {
    onHover?.(true);
    setIsAnimated(true);
  };
  const manageMouseLeave = () => {
    onHover?.(false);
    setIsAnimated(false);
  };
  const textToUse = text || extractTextFromChildren(children);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `relative flex cursor-pointer justify-center md:justify-center sm:justify-start ${className || ""}`,
      onMouseEnter: manageMouseEnter,
      onMouseLeave: manageMouseLeave,
      style: {
        color: "#000000",
        fontSize: "inherit",
        fontFamily: "inherit",
        lineHeight: "inherit",
        letterSpacing: "inherit",
        overflow: "visible"
      },
      ...props,
      children: splitWord(textToUse)
    }
  );
}

const GetInTouchIsland = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    interests: [],
    budget: "",
    message: "",
    attachment: null
  });
  const [focusedField, setFocusedField] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError, ToastContainer } = useToast();
  const interestOptions = [
    "Website Design",
    "Website Development",
    "Motion & Graphic Design"
  ];
  const budgetOptions = [
    "< $1,000",
    "$1,000 - $5,000",
    "$5,000 - $10,000",
    "$10,000 - $20,000",
    "> $20,000"
  ];
  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter((i) => i !== interest) : [...prev.interests, interest]
    }));
  };
  const handleBudgetSelect = (budget) => {
    setFormData((prev) => ({
      ...prev,
      budget: prev.budget === budget ? "" : budget
    }));
  };
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showError("File is too large. Maximum size is 10MB.");
        event.target.value = "";
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      attachment: file
    }));
  };
  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      attachment: null
    }));
    const fileInput = document.getElementById("file-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showError("Please complete name, email and message fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("country", formData.country);
      submitData.append("message", formData.message);
      submitData.append("budget", formData.budget);
      formData.interests.forEach((interest) => {
        submitData.append("interests", interest);
      });
      if (formData.attachment) {
        submitData.append("attachment", formData.attachment);
      }
      const response = await fetch("/api/send-email", {
        method: "POST",
        body: submitData
      });
      const result = await response.json();
      if (result.success) {
        showSuccess("Message sent successfully! I will contact you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          country: "",
          interests: [],
          budget: "",
          message: "",
          attachment: null
        });
      } else {
        showError(result.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error enviando formulario:", error);
      showError("Connection error. Please check your internet and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "contact-form", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "contact-header",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6, ease: "easeOut" },
        children: [
          /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "contact-subtitle",
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.5, delay: 0.1 },
              children: "Contact Me"
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "contact-title",
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.6, delay: 0.2 },
              children: /* @__PURE__ */ jsx(
                TextDisperse,
                {
                  text: "Get In Touch",
                  className: "text-white font-display",
                  style: {
                    fontSize: "clamp(60px, 8vw, 100px)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 400,
                    lineHeight: "64px",
                    color: "white"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              className: "contact-description",
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.6, delay: 0.4 },
              style: {
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "var(--font-primary)",
                fontSize: "clamp(14px, 2vw, 18px)",
                fontWeight: 400,
                lineHeight: 1.4,
                textAlign: "left",
                margin: 0,
                maxWidth: "600px"
              },
              children: "Ready to bring your ideas to life? Let's discuss your project"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.form,
      {
        onSubmit: handleSubmit,
        className: "contact-form-container",
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.7, delay: 0.3 },
        children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              className: "form-row",
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.6, delay: 0.4 },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "form-field", children: [
                  /* @__PURE__ */ jsxs("label", { className: "field-label", children: [
                    /* @__PURE__ */ jsx(User, { size: 18, className: "inline-block" }),
                    "Your Name"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "input-container", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        placeholder: "John Smith",
                        value: formData.name,
                        onChange: (e) => setFormData((prev) => ({ ...prev, name: e.target.value })),
                        onFocus: () => setFocusedField("name"),
                        onBlur: () => setFocusedField(null),
                        className: `field-input ${focusedField === "name" ? "focused" : ""}`
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "field-underline" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "form-field", children: [
                  /* @__PURE__ */ jsxs("label", { className: "field-label", children: [
                    /* @__PURE__ */ jsx(Mail, { size: 18, className: "inline-block" }),
                    "Your Email"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "input-container", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "email",
                        placeholder: "john@company.com",
                        value: formData.email,
                        onChange: (e) => setFormData((prev) => ({ ...prev, email: e.target.value })),
                        onFocus: () => setFocusedField("email"),
                        onBlur: () => setFocusedField(null),
                        className: `field-input ${focusedField === "email" ? "focused" : ""}`
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "field-underline" })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              className: "form-row",
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.6, delay: 0.5 },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "form-field", children: [
                  /* @__PURE__ */ jsxs("label", { className: "field-label", children: [
                    /* @__PURE__ */ jsx(Phone, { size: 18, className: "inline-block" }),
                    "Your Phone"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "input-container", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "tel",
                        placeholder: "+52 123 4444 4444",
                        value: formData.phone,
                        onChange: (e) => setFormData((prev) => ({ ...prev, phone: e.target.value })),
                        onFocus: () => setFocusedField("phone"),
                        onBlur: () => setFocusedField(null),
                        className: `field-input ${focusedField === "phone" ? "focused" : ""}`
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "field-underline" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "form-field", children: [
                  /* @__PURE__ */ jsxs("label", { className: "field-label", children: [
                    /* @__PURE__ */ jsx(Globe, { size: 18, className: "inline-block" }),
                    "Country"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "input-container", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        placeholder: "Mexico, United States, Canada",
                        value: formData.country,
                        onChange: (e) => setFormData((prev) => ({ ...prev, country: e.target.value })),
                        onFocus: () => setFocusedField("country"),
                        onBlur: () => setFocusedField(null),
                        className: `field-input ${focusedField === "country" ? "focused" : ""}`
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "field-underline" })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              className: "interests-section",
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.6, delay: 0.6 },
              children: [
                /* @__PURE__ */ jsxs("label", { className: "field-label", children: [
                  /* @__PURE__ */ jsx(Heart, { size: 18, className: "inline-block" }),
                  "I'm interested in..."
                ] }),
                /* @__PURE__ */ jsx("div", { className: "interests-options", children: interestOptions.map((interest, index) => /* @__PURE__ */ jsx(
                  motion.button,
                  {
                    type: "button",
                    onClick: () => handleInterestToggle(interest),
                    className: `interest-pill clickable ${formData.interests.includes(interest) ? "selected" : ""}`,
                    initial: { opacity: 0, scale: 0.8 },
                    whileInView: { opacity: 1, scale: 1 },
                    viewport: { once: true, margin: "-100px" },
                    transition: { duration: 0.4, delay: 0.7 + index * 0.1 },
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    children: interest
                  },
                  interest
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              className: "budget-section",
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.6, delay: 0.8 },
              children: [
                /* @__PURE__ */ jsxs("label", { className: "field-label", children: [
                  /* @__PURE__ */ jsx(DollarSign, { size: 18, className: "inline-block" }),
                  "Your Budget (USD)"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "budget-options", children: budgetOptions.map((budget, index) => /* @__PURE__ */ jsx(
                  motion.button,
                  {
                    type: "button",
                    onClick: () => handleBudgetSelect(budget),
                    className: `budget-pill clickable ${formData.budget === budget ? "selected" : ""}`,
                    initial: { opacity: 0, scale: 0.8 },
                    whileInView: { opacity: 1, scale: 1 },
                    viewport: { once: true, margin: "-100px" },
                    transition: { duration: 0.4, delay: 0.9 + index * 0.1 },
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    children: budget
                  },
                  budget
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              className: "message-section",
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.6, delay: 1 },
              children: [
                /* @__PURE__ */ jsxs("label", { className: "field-label", children: [
                  /* @__PURE__ */ jsx(MessageSquare, { size: 18, className: "inline-block" }),
                  "More About The Project"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "message-container", children: /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    placeholder: "Tell me more about your project...",
                    value: formData.message,
                    onChange: (e) => setFormData((prev) => ({ ...prev, message: e.target.value })),
                    onFocus: () => setFocusedField("message"),
                    onBlur: () => setFocusedField(null),
                    className: `message-input ${focusedField === "message" ? "focused" : ""}`
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "message-underline" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              className: "attachment-section",
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.6, delay: 1.1 },
              children: [
                /* @__PURE__ */ jsxs(
                  motion.label,
                  {
                    htmlFor: "file-upload",
                    className: "attachment-button clickable",
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    children: [
                      /* @__PURE__ */ jsx(Paperclip, { size: 18, className: "inline-block" }),
                      /* @__PURE__ */ jsx("span", { children: "Add an Attachment" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "file-upload",
                    type: "file",
                    onChange: handleFileUpload,
                    className: "file-input",
                    accept: ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  }
                ),
                formData.attachment && /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    className: "attachment-tag",
                    initial: { opacity: 0, scale: 0.8 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { duration: 0.3 },
                    children: /* @__PURE__ */ jsxs("div", { className: "attachment-tag-content", children: [
                      /* @__PURE__ */ jsx(FileText, { size: 16, className: "attachment-icon" }),
                      /* @__PURE__ */ jsxs("div", { className: "attachment-info", children: [
                        /* @__PURE__ */ jsx("span", { className: "attachment-name", children: formData.attachment.name }),
                        /* @__PURE__ */ jsxs("span", { className: "attachment-size", children: [
                          (formData.attachment.size / 1024).toFixed(1),
                          " KB"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx(
                        motion.button,
                        {
                          type: "button",
                          onClick: handleRemoveFile,
                          className: "remove-attachment-btn",
                          whileHover: { scale: 1.1 },
                          whileTap: { scale: 0.9 },
                          transition: { duration: 0.2 },
                          children: /* @__PURE__ */ jsx(X, { size: 14 })
                        }
                      )
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "file-specs", children: /* @__PURE__ */ jsx("span", { children: "Max 10MB • PDF, DOC, DOCX, TXT, JPG, PNG" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "submit-section",
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.6, delay: 1.2 },
              children: /* @__PURE__ */ jsxs(
                motion.button,
                {
                  type: "submit",
                  disabled: isSubmitting,
                  className: `submit-button clickable ${isSubmitting ? "submitting" : ""}`,
                  whileHover: !isSubmitting ? { scale: 1.05, y: -2 } : {},
                  whileTap: !isSubmitting ? { scale: 0.95 } : {},
                  transition: { duration: 0.2 },
                  style: {
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? "not-allowed" : "pointer"
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { children: isSubmitting ? "Sending..." : "Send Request" }),
                    /* @__PURE__ */ jsx("div", { className: "submit-icon", children: isSubmitting ? /* @__PURE__ */ jsx(Loader2, { size: 18, className: "animate-spin", color: "white" }) : /* @__PURE__ */ jsx(Send, { size: 18, color: "white" }) })
                  ]
                }
              )
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(ToastContainer, {})
  ] });
};

const declarePI = `
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`;
const proceduralHash11 = `
  float hash11(float p) {
    p = fract(p * 0.3183099) + 0.1;
    p *= p + 19.19;
    return fract(p * p);
  }
`;
const proceduralHash21 = `
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`;
const simplexNoise = `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;
const vertexShaderSource = `#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`;
const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_colorBack;
uniform vec4 u_colorFront;
uniform float u_shape;
uniform float u_type;
uniform float u_pxSize;

out vec4 fragColor;

${simplexNoise}
${declarePI}
${proceduralHash11}
${proceduralHash21}

float getSimplexNoise(vec2 uv, float t) {
  float noise = .5 * snoise(uv - vec2(0., .3 * t));
  noise += .5 * snoise(2. * uv + vec2(0., .32 * t));
  return noise;
}

const int bayer2x2[4] = int[4](0, 2, 3, 1);
const int bayer4x4[16] = int[16](
  0,  8,  2, 10,
 12,  4, 14,  6,
  3, 11,  1,  9,
 15,  7, 13,  5
);

const int bayer8x8[64] = int[64](
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(mod(uv, float(size)));
  int index = pos.y * size + pos.x;

  if (size == 2) {
    return float(bayer2x2[index]) / 4.0;
  } else if (size == 4) {
    return float(bayer4x4[index]) / 16.0;
  } else if (size == 8) {
    return float(bayer8x8[index]) / 64.0;
  }
  return 0.0;
}

void main() {
  float t = .5 * u_time;
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv -= .5;
  
  // Apply pixelization
  float pxSize = u_pxSize;
  vec2 pxSizeUv = gl_FragCoord.xy;
  pxSizeUv -= .5 * u_resolution;
  pxSizeUv /= pxSize;
  vec2 pixelizedUv = floor(pxSizeUv) * pxSize / u_resolution.xy;
  pixelizedUv += .5;
  pixelizedUv -= .5;
  
  vec2 shape_uv = pixelizedUv;
  vec2 dithering_uv = pxSizeUv;
  vec2 ditheringNoise_uv = uv * u_resolution;

  float shape = 0.;
  if (u_shape < 1.5) {
    // Simplex noise
    shape_uv *= .001;
    shape = 0.5 + 0.5 * getSimplexNoise(shape_uv, t);
    shape = smoothstep(0.3, 0.9, shape);

  } else if (u_shape < 2.5) {
    // Warp
    shape_uv *= .003;
    for (float i = 1.0; i < 6.0; i++) {
      shape_uv.x += 0.6 / i * cos(i * 2.5 * shape_uv.y + t);
      shape_uv.y += 0.6 / i * cos(i * 1.5 * shape_uv.x + t);
    }
    shape = .15 / abs(sin(t - shape_uv.y - shape_uv.x));
    shape = smoothstep(0.02, 1., shape);

  } else if (u_shape < 3.5) {
    // Dots
    shape_uv *= .05;
    float stripeIdx = floor(2. * shape_uv.x / TWO_PI);
    float rand = hash11(stripeIdx * 10.);
    rand = sign(rand - .5) * pow(.1 + abs(rand), .4);
    shape = sin(shape_uv.x) * cos(shape_uv.y - 5. * rand * t);
    shape = pow(abs(shape), 6.);

  } else if (u_shape < 4.5) {
    // Sine wave
    shape_uv *= 4.;
    float wave = cos(.5 * shape_uv.x - 2. * t) * sin(1.5 * shape_uv.x + t) * (.75 + .25 * cos(3. * t));
    shape = 1. - smoothstep(-1., 1., shape_uv.y + wave);

  } else if (u_shape < 5.5) {
    // Ripple
    float dist = length(shape_uv);
    float waves = sin(pow(dist, 1.7) * 7. - 3. * t) * .5 + .5;
    shape = waves;

  } else if (u_shape < 6.5) {
    // Swirl
    float l = length(shape_uv);
    float angle = 6. * atan(shape_uv.y, shape_uv.x) + 4. * t;
    float twist = 1.2;
    float offset = pow(l, -twist) + angle / TWO_PI;
    float mid = smoothstep(0., 1., pow(l, twist));
    shape = mix(0., fract(offset), mid);

  } else {
    // Sphere
    shape_uv *= 2.;
    float d = 1. - pow(length(shape_uv), 2.);
    vec3 pos = vec3(shape_uv, sqrt(d));
    vec3 lightPos = normalize(vec3(cos(1.5 * t), .8, sin(1.25 * t)));
    shape = .5 + .5 * dot(lightPos, pos);
    shape *= step(0., d);
  }

  int type = int(floor(u_type));
  float dithering = 0.0;

  switch (type) {
    case 1: {
      dithering = step(hash21(ditheringNoise_uv), shape);
    } break;
    case 2:
      dithering = getBayerValue(dithering_uv, 2);
      break;
    case 3:
      dithering = getBayerValue(dithering_uv, 4);
      break;
    default:
      dithering = getBayerValue(dithering_uv, 8);
      break;
  }

  dithering -= .5;
  float res = step(.5, shape + dithering);

  vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
  float fgOpacity = u_colorFront.a;
  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  float bgOpacity = u_colorBack.a;

  vec3 color = fgColor * res;
  float opacity = fgOpacity * res;

  color += bgColor * (1. - opacity);
  opacity += bgOpacity * (1. - opacity);

  fragColor = vec4(color, opacity);
}
`;
const DitheringShapes = {
  simplex: 1,
  warp: 2,
  dots: 3,
  wave: 4,
  ripple: 5,
  swirl: 6,
  sphere: 7
};
const DitheringTypes = {
  random: 1,
  "2x2": 2,
  "4x4": 3,
  "8x8": 4
};
function hexToRgba(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0, 1];
  return [
    Number.parseInt(result[1], 16) / 255,
    Number.parseInt(result[2], 16) / 255,
    Number.parseInt(result[3], 16) / 255,
    1
  ];
}
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
function createProgram(gl, vertexShaderSource2, fragmentShaderSource2) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource2);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource2);
  if (!vertexShader || !fragmentShader) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}
function DitheringShader({
  width = 800,
  height = 800,
  colorBack = "#e6d9fb",
  colorFront = "#9D7FC1",
  shape = "warp",
  type = "8x8",
  pxSize = 2,
  speed = 0.3,
  className = "",
  style = {}
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(void 0);
  const programRef = useRef(null);
  const glRef = useRef(null);
  const uniformLocationsRef = useRef({});
  const startTimeRef = useRef(Date.now());
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }
    glRef.current = gl;
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    if (!program) return;
    programRef.current = program;
    uniformLocationsRef.current = {
      u_time: gl.getUniformLocation(program, "u_time"),
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_colorBack: gl.getUniformLocation(program, "u_colorBack"),
      u_colorFront: gl.getUniformLocation(program, "u_colorFront"),
      u_shape: gl.getUniformLocation(program, "u_shape"),
      u_type: gl.getUniformLocation(program, "u_type"),
      u_pxSize: gl.getUniformLocation(program, "u_pxSize")
    };
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    const render = () => {
      const currentTime = (Date.now() - startTimeRef.current) * 1e-3 * speed;
      const context = glRef.current;
      const shaderProgram = programRef.current;
      if (!context || !shaderProgram) return;
      context.clear(context.COLOR_BUFFER_BIT);
      context["useProgram"](shaderProgram);
      const locations = uniformLocationsRef.current;
      if (locations.u_time) context.uniform1f(locations.u_time, currentTime);
      if (locations.u_resolution) context.uniform2f(locations.u_resolution, width, height);
      if (locations.u_colorBack) context.uniform4fv(locations.u_colorBack, hexToRgba(colorBack));
      if (locations.u_colorFront) context.uniform4fv(locations.u_colorFront, hexToRgba(colorFront));
      if (locations.u_shape) context.uniform1f(locations.u_shape, DitheringShapes[shape]);
      if (locations.u_type) context.uniform1f(locations.u_type, DitheringTypes[type]);
      if (locations.u_pxSize) context.uniform1f(locations.u_pxSize, pxSize);
      context.drawArrays(context.TRIANGLES, 0, 6);
      if (speed !== 0) {
        animationRef.current = requestAnimationFrame(render);
      }
    };
    const startAnimation = () => {
      if (speed !== 0) {
        animationRef.current = requestAnimationFrame(render);
      }
    };
    startAnimation();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (glRef.current && programRef.current) {
        glRef.current.deleteProgram(programRef.current);
      }
    };
  }, [width, height, colorBack, colorFront, shape, type, pxSize, speed]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className,
      style: {
        position: "relative",
        width,
        height,
        ...style
      },
      children: /* @__PURE__ */ jsx(
        "canvas",
        {
          ref: canvasRef,
          style: {
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }
        }
      )
    }
  );
}

function NoiseBackground({
  opacity = 0.9,
  speed = 0.2,
  className = ""
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `noise-background ${className}`,
      style: {
        position: "fixed",
        top: "-50%",
        left: "-50%",
        right: "-50%",
        bottom: "-50%",
        width: "200%",
        height: "200vh",
        background: `transparent url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E") repeat 0 0`,
        backgroundRepeat: "repeat",
        backgroundSize: "600px 600px",
        animation: `noiseAnimation ${speed}s infinite`,
        opacity,
        visibility: "visible",
        pointerEvents: "none",
        zIndex: 1
      }
    }
  );
}
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes noiseAnimation {
      0% { transform: translate(0,0) }
      10% { transform: translate(-5%,-5%) }
      20% { transform: translate(-10%,5%) }
      30% { transform: translate(5%,-10%) }
      40% { transform: translate(-5%,15%) }
      50% { transform: translate(-10%,5%) }
      60% { transform: translate(15%,0) }
      70% { transform: translate(0,10%) }
      80% { transform: translate(-15%,0) }
      90% { transform: translate(10%,5%) }
      100% { transform: translate(5%,0) }
    }
    
    .noise-background {
      mix-blend-mode: multiply;
    }
    
    /* Variante más sutil para backgrounds claros */
    .noise-background.light {
      mix-blend-mode: overlay;
      opacity: 0.3 !important;
    }
    
    /* Variante más intensa para backgrounds oscuros */
    .noise-background.dark {
      mix-blend-mode: screen;
      opacity: 0.15 !important;
    }
  `;
  document.head.appendChild(style);
}

const reviewsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    description: "Karen delivered an exceptional website that exceeded all our expectations. Her attention to detail and creative vision transformed our brand completely."
  },
  {
    id: 2,
    name: "Michael Chen",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    description: "Working with Karen was a game-changer for our startup. She created a stunning UI/UX that our users absolutely love. Highly recommended!"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    description: "Karen's motion design skills are incredible. She brought our static designs to life with beautiful animations that perfectly capture our brand essence."
  },
  {
    id: 4,
    name: "David Thompson",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    description: "Professional, creative, and reliable. Karen delivered our e-commerce platform on time and within budget. The results speak for themselves."
  },
  {
    id: 5,
    name: "Lisa Park",
    profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    description: "Karen's art direction elevated our entire visual identity. She has an amazing eye for design and understands how to create compelling user experiences."
  },
  {
    id: 6,
    name: "James Wilson",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    description: "Exceptional work on our mobile app. Karen's technical skills combined with her design expertise resulted in a product our customers can't stop talking about."
  }
];
const ReviewsIsland = () => {
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const createReviewsMarquee = () => {
      const container = containerRef.current;
      if (!container) return;
      container.innerHTML = "";
      const marqueeWrapper = document.createElement("div");
      marqueeWrapper.className = "reviews-marquee-wrapper";
      const marqueeContainer = document.createElement("div");
      marqueeContainer.className = "reviews-marquee";
      const createReviewCard = (review) => {
        const card = document.createElement("div");
        card.className = "review-card-marquee";
        card.innerHTML = `
          <div class="card-inner">
            <div class="gradient-border"></div>
            
            <!-- Profile section -->
            <div class="profile-section">
              <div class="profile-pic">
                <img src="${review.profilePic}" alt="${review.name}" loading="lazy" />
              </div>
              <h3 class="reviewer-name">${review.name}</h3>
            </div>
            
            <!-- Review description -->
            <p class="review-description">
              ${review.description}
            </p>
          </div>
        `;
        return card;
      };
      const firstSet = document.createElement("div");
      firstSet.className = "reviews-set";
      reviewsData.forEach((review) => {
        firstSet.appendChild(createReviewCard(review));
      });
      const secondSet = document.createElement("div");
      secondSet.className = "reviews-set";
      reviewsData.forEach((review) => {
        secondSet.appendChild(createReviewCard(review));
      });
      marqueeContainer.appendChild(firstSet);
      marqueeContainer.appendChild(secondSet);
      marqueeWrapper.appendChild(marqueeContainer);
      container.appendChild(marqueeWrapper);
    };
    const setupIntersectionObserver = () => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const marquee = entry.target.querySelector(".reviews-marquee");
            if (marquee) {
              if (entry.isIntersecting) {
                marquee.style.animationPlayState = "running";
              } else {
                marquee.style.animationPlayState = "paused";
              }
            }
          });
        },
        {
          rootMargin: "200px 0px",
          threshold: 0.1
        }
      );
      if (containerRef.current) {
        observerRef.current.observe(containerRef.current);
      }
    };
    createReviewsMarquee();
    setupIntersectionObserver();
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);
  return /* @__PURE__ */ jsx("div", { ref: containerRef, className: "reviews-container" });
};

const $$GetInTouch = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section id="contact" class="get-in-touch-section" data-astro-cid-ruuwmxuo> <!-- Noise Background Effect --> ${renderComponent($$result, "NoiseBackground", NoiseBackground, { "opacity": 0.08, "speed": 0.2, "className": "dark", "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/NoiseBackground.tsx", "client:component-export": "NoiseBackground", "data-astro-cid-ruuwmxuo": true })} <!-- DitheringShader Background - Igual que Projects pero con menor opacidad --> <div class="dithering-background" data-astro-cid-ruuwmxuo> ${renderComponent($$result, "DitheringShader", DitheringShader, { "client:visible": true, "width": 1920, "height": 1800, "colorBack": "#000000", "colorFront": "#ffffff", "shape": "swirl", "type": "8x8", "pxSize": 4, "speed": 0.4, "client:component-hydration": "visible", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/three/DitheringShader.tsx", "client:component-export": "DitheringShader", "data-astro-cid-ruuwmxuo": true })} </div> <!-- Main Content --> <div class="contact-container" data-astro-cid-ruuwmxuo> ${renderComponent($$result, "GetInTouchIsland", GetInTouchIsland, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/GetInTouchIsland.tsx", "client:component-export": "default", "data-astro-cid-ruuwmxuo": true })} </div> <!-- Reviews Section --> <div class="reviews-container" data-astro-cid-ruuwmxuo> ${renderComponent($$result, "ReviewsIsland", ReviewsIsland, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/ReviewsIsland.tsx", "client:component-export": "default", "data-astro-cid-ruuwmxuo": true })} </div> </section> `;
}, "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/GetInTouch.astro", void 0);

const $$Astro = createAstro();
const $$SecondaryButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SecondaryButton;
  const {
    text = "Check Projects",
    size = "default",
    variant = "glass"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="glass-button-wrap" data-astro-cid-x2f44qd4> <button${addAttribute(`glass-button glass-button-${size} glass-button-${variant}`, "class")} data-astro-cid-x2f44qd4> <span${addAttribute(`glass-button-text glass-button-text-${size}`, "class")} data-astro-cid-x2f44qd4> <span class="text-content" data-astro-cid-x2f44qd4>${text}</span> <span class="rocket-emoji" data-astro-cid-x2f44qd4>🚀</span> </span> </button> <div class="glass-button-shadow" data-astro-cid-x2f44qd4></div> </div>  ${renderScript($$result, "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/SecondaryButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/SecondaryButton.astro", void 0);

export { $$MainButton as $, DitheringShader as D, NoiseBackground as N, TextDisperse as T, $$Layout as a, $$SecondaryButton as b, $$GetInTouch as c };
