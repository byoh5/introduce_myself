(function () {
  const navLinks = Array.from(document.querySelectorAll('#global-nav a'));
  const pageAnchorLinks = navLinks.filter(function (link) {
    const href = link.getAttribute('href');
    return href && href.charAt(0) === '#';
  });
  const sections = pageAnchorLinks
    .map(function (link) {
      const id = link.getAttribute('href');
      return id ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (!sections.length || !navLinks.length) {
    return;
  }

  const setActiveLink = function (id) {
    pageAnchorLinks.forEach(function (link) {
      const isMatch = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-35% 0px -50% 0px',
      threshold: 0.02,
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();

(function () {
  const printButtons = document.querySelectorAll('[data-print-resume]');
  const status = document.querySelector('[data-resume-status]');

  const setStatus = function (message) {
    if (!status) {
      return;
    }

    status.textContent = message || '';
  };

  const loadScript = function (src) {
    return new Promise(function (resolve, reject) {
      const existingScript = document.querySelector('script[data-pdf-lib="' + src + '"]');

      if (existingScript && existingScript.dataset.loaded === 'true') {
        resolve();
        return;
      }

      if (existingScript) {
        existingScript.addEventListener('load', function () {
          resolve();
        }, { once: true });
        existingScript.addEventListener('error', function () {
          reject(new Error('Failed to load ' + src));
        }, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.pdfLib = src;
      script.addEventListener('load', function () {
        script.dataset.loaded = 'true';
        resolve();
      }, { once: true });
      script.addEventListener('error', function () {
        script.remove();
        reject(new Error('Failed to load ' + src));
      }, { once: true });
      document.head.appendChild(script);
    });
  };

  const ensurePdfLibraries = function () {
    const libs = [];

    if (!window.html2canvas) {
      libs.push(loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'));
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
      libs.push(loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'));
    }

    return Promise.all(libs);
  };

  const exportResumePdf = async function (button) {
    const resumeSheet = document.querySelector('.resume-sheet');

    if (!resumeSheet) {
      return;
    }

    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'PDF 생성 중...';
    setStatus('화면과 동일한 레이아웃으로 PDF를 생성하고 있습니다.');

    try {
      await ensurePdfLibraries();

      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      await new Promise(function (resolve) {
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(resolve);
        });
      });

      const canvas = await window.html2canvas(resumeSheet, {
        backgroundColor: '#ffffff',
        scale: Math.max(window.devicePixelRatio, 2),
        useCORS: true,
      });

      const imageData = canvas.toDataURL('image/png');
      const jsPDF = window.jspdf.jsPDF;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      pdf.addImage(imageData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.save('Byungyun_Oh_Resume.pdf');
      setStatus('PDF 다운로드가 시작되었습니다.');
    } catch (error) {
      console.error(error);
      setStatus('PDF 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  };

  if (!printButtons.length) {
    return;
  }

  printButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      exportResumePdf(button);
    });
  });
})();
