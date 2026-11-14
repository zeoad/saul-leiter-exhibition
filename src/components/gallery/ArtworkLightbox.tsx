"use client";

import { useEffect } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

type CaptionData = { caption?: string };

export default function ArtworkLightbox() {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "body",
      children: "a[data-pswp-lightbox]",
      pswpModule: () => import("photoswipe"),
      bgOpacity: 1,
      showHideAnimationType: "fade",
      padding: { top: 72, bottom: 86, left: 16, right: 16 },
      closeTitle: "关闭 (Esc)",
      zoomTitle: "缩放",
      arrowPrevTitle: "上一张",
      arrowNextTitle: "下一张",
      errorMsg: "图片加载失败",
    });

    lightbox.addFilter("itemData", (itemData) => {
      const element = (itemData as { element?: HTMLElement }).element;
      const caption = element?.getAttribute("data-pswp-caption") ?? "";
      (itemData as CaptionData).caption = caption;
      return itemData;
    });

    lightbox.on("uiRegister", () => {
      lightbox.pswp?.ui?.registerElement({
        name: "aquietgaze-caption",
        order: 9,
        appendTo: "root",
        tagName: "div",
        className: "pswp-aqg-caption",
        html: "",
        onInit: (element, pswp) => {
          const update = () => {
            const data = pswp.currSlide?.data as CaptionData | undefined;
            element.textContent = data?.caption ?? "";
          };

          pswp.on("change", update);
          update();
        },
      });
    });

    lightbox.init();

    const onOpen = () => {
      document.documentElement.classList.add("lightbox-open");
    };

    const onClose = () => {
      document.documentElement.classList.remove("lightbox-open");
    };

    lightbox.on("beforeOpen", onOpen);
    lightbox.on("close", onClose);

    return () => {
      document.documentElement.classList.remove("lightbox-open");
      lightbox.destroy();
    };
  }, []);

  return null;
}
