// 登機倒數：測一張暫停生活的單程機票 - 核心互動邏輯

document.addEventListener('DOMContentLoaded', () => {
  // App State
  const state = {
    passengerName: 'TRAVELER',
    selectedPool: 'short', // 'short' or 'long'
    currentQuestionIndex: 0, // 0 = Q0, 1 = Q1, ... 8 = Q8
    scores: {},
    userAnswers: {}, // Stores option chosen for each question ID
    topThreeCandidates: [],
    finalDestination: null
  };

  // DOM Elements
  const views = {
    landing: document.getElementById('landingView'),
    quiz: document.getElementById('quizView'),
    blindPick: document.getElementById('blindPickView'),
    loading: document.getElementById('loadingView'),
    result: document.getElementById('resultView')
  };

  const elements = {
    passengerInput: document.getElementById('passengerNameInput'),
    startBtn: document.getElementById('startBtn'),
    vinylBtn: document.getElementById('vinylBtn'),
    vinylLabel: document.getElementById('vinylLabel'),

    // Runway Progress Bar
    runwayContainer: document.getElementById('runwayContainer'),
    runwayStepText: document.getElementById('runwayStepText'),
    runwayPercentText: document.getElementById('runwayPercentText'),
    runwayFill: document.getElementById('runwayFill'),
    runwayAirplane: document.getElementById('runwayAirplane'),

    // Quiz Box
    quizHeaderTag: document.getElementById('quizHeaderTag'),
    qNumberStamp: document.getElementById('qNumberStamp'),
    qTitle: document.getElementById('qTitle'),
    qSubtitle: document.getElementById('qSubtitle'),
    optionsList: document.getElementById('optionsList'),

    // Blind Pick
    blindCardsGrid: document.getElementById('blindCardsGrid'),

    // Loading
    typewriterText: document.getElementById('typewriterText'),

    // Result
    resultTicketImg: document.getElementById('resultTicketImg'),
    resultCityBadge: document.getElementById('resultCityBadge'),
    resultPoeticQuote: document.getElementById('resultPoeticQuote'),
    resultTagline: document.getElementById('resultTagline'),
    resultTagsRow: document.getElementById('resultTagsRow'),
    metaPassenger: document.getElementById('metaPassenger'),
    metaFlight: document.getElementById('metaFlight'),
    metaGateSeat: document.getElementById('metaGateSeat'),
    downloadBtn: document.getElementById('downloadBtn'),
    restartBtn: document.getElementById('restartBtn'),
    shareBtn: document.getElementById('shareBtn'),
    toastMsg: document.getElementById('toastMsg'),
    exportCanvas: document.getElementById('exportCanvas')
  };

  // Switch Active View
  function showView(viewKey) {
    Object.keys(views).forEach(key => {
      if (key === viewKey) {
        views[key].style.display = 'block';
        setTimeout(() => views[key].classList.add('active'), 20);
      } else {
        views[key].classList.remove('active');
        views[key].style.display = 'none';
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Toast Notification
  function showToast(text) {
    elements.toastMsg.textContent = text;
    elements.toastMsg.classList.add('show');
    setTimeout(() => {
      elements.toastMsg.classList.remove('show');
    }, 2500);
  }

  // Audio Switch Click
  elements.vinylBtn.addEventListener('click', () => {
    audioCtrl.toggleBGM();
    elements.vinylLabel.textContent = audioCtrl.isPlaying ? 'BGM ON' : 'BGM OFF';
  });

  // 1. Start Quiz Button
  elements.startBtn.addEventListener('click', () => {
    const rawName = elements.passengerInput.value.trim();
    // Default to TRAVELER if left empty
    state.passengerName = rawName ? rawName.slice(0, 10).toUpperCase() : 'TRAVELER';

    // Start background music
    audioCtrl.startBGM();
    elements.vinylLabel.textContent = 'BGM ON';

    // Go to Q0
    state.currentQuestionIndex = 0;
    renderQuestion(0);
    showView('quiz');
  });

  // 2. Render Question
  function renderQuestion(qIndex) {
    const qData = QUIZ_QUESTIONS[qIndex];
    if (!qData) return;

    // Handle Q0 vs Q1-Q8 UI
    if (qData.isBranching) {
      // Hide runway & tags on Q0
      elements.runwayContainer.style.display = 'none';
      if (elements.quizHeaderTag) elements.quizHeaderTag.style.display = 'none';
    } else {
      // Show runway & question number tag on Q1-Q8
      elements.runwayContainer.style.display = 'block';
      if (elements.quizHeaderTag) elements.quizHeaderTag.style.display = 'flex';

      const pct = Math.round((qIndex / 8) * 100);
      elements.runwayStepText.textContent = `RUNWAY CHECKPOINT 0${qIndex} / 08`;
      elements.runwayPercentText.textContent = `${pct}%`;
      elements.runwayFill.style.width = `${pct}%`;
      elements.runwayAirplane.style.left = `${pct}%`;

      // Purely show question number: Q01, Q02...
      elements.qNumberStamp.textContent = `Q0${qIndex}`;
    }

    elements.qTitle.textContent = qData.title;

    if (qData.subtitle) {
      elements.qSubtitle.textContent = qData.subtitle;
      elements.qSubtitle.style.display = 'block';
    } else {
      elements.qSubtitle.style.display = 'none';
    }

    // Render Options
    elements.optionsList.innerHTML = '';
    qData.options.forEach((opt) => {
      const optItem = document.createElement('div');
      optItem.className = 'option-item';
      
      let html = `
        <div class="option-letter">${opt.letter}</div>
        <div class="option-content">
          <div class="option-text-main">${opt.text}</div>
          ${opt.subtext ? `<div class="option-subtext">${opt.subtext}</div>` : ''}
        </div>
      `;
      optItem.innerHTML = html;

      optItem.addEventListener('click', () => {
        handleOptionSelect(qData, opt);
      });

      elements.optionsList.appendChild(optItem);
    });
  }

  // 3. Option Selection Handler
  function handleOptionSelect(qData, opt) {
    audioCtrl.playClickSound();

    if (qData.isBranching) {
      // Q0 Choice
      state.selectedPool = opt.pool;
      
      // Initialize zero scores for chosen pool
      state.scores = {};
      Object.keys(DESTINATIONS).forEach(cityName => {
        if (DESTINATIONS[cityName].category === state.selectedPool) {
          state.scores[cityName] = 0;
        }
      });

      state.currentQuestionIndex = 1;
      renderQuestion(1);
    } else {
      // Q1 ~ Q8
      state.userAnswers[qData.id] = opt;

      // Add scores to mapped cities in current pool
      if (opt.scores && opt.scores[state.selectedPool]) {
        opt.scores[state.selectedPool].forEach(cityName => {
          if (state.scores[cityName] !== undefined) {
            state.scores[cityName] += 1;
          }
        });
      }

      state.currentQuestionIndex++;
      if (state.currentQuestionIndex <= 8) {
        renderQuestion(state.currentQuestionIndex);
      } else {
        // Quiz completed -> calculate top 3 and show blind pick
        calculateTopThreeAndShowBlindPick();
      }
    }
  }

  // 4. Calculate Top 3 & Blind Pick Screen
  function calculateTopThreeAndShowBlindPick() {
    // Get candidate cities for current pool
    const candidateCities = Object.keys(state.scores).filter(
      cityName => DESTINATIONS[cityName].category === state.selectedPool
    );

    // Tie-breaking priority helper:
    // If scores equal: Q7 scored city > Q1 scored city > Q8 scored city
    function getCityTieBreakScore(cityName) {
      let weight = 0;
      const q7Opt = state.userAnswers['q7'];
      const q1Opt = state.userAnswers['q1'];
      const q8Opt = state.userAnswers['q8'];

      if (q7Opt && q7Opt.scores && q7Opt.scores[state.selectedPool]?.includes(cityName)) weight += 100;
      if (q1Opt && q1Opt.scores && q1Opt.scores[state.selectedPool]?.includes(cityName)) weight += 10;
      if (q8Opt && q8Opt.scores && q8Opt.scores[state.selectedPool]?.includes(cityName)) weight += 1;
      return weight;
    }

    // Sort descending by base score, then by tie-break score, then stable hash
    candidateCities.sort((a, b) => {
      const scoreDiff = state.scores[b] - state.scores[a];
      if (scoreDiff !== 0) return scoreDiff;
      const tbDiff = getCityTieBreakScore(b) - getCityTieBreakScore(a);
      if (tbDiff !== 0) return tbDiff;
      return a.localeCompare(b);
    });

    // Top 3 destinations
    const top3Names = candidateCities.slice(0, 3);
    state.topThreeCandidates = top3Names.map(name => DESTINATIONS[name]);

    // Shuffle top 3 for purely intuitive blind pick
    const shuffledTop3 = [...state.topThreeCandidates].sort(() => Math.random() - 0.5);

    // Render 3 Quote Cards (NO CITY NAMES, TWO-LINE CENTERED)
    elements.blindCardsGrid.innerHTML = '';
    shuffledTop3.forEach((dest, index) => {
      const card = document.createElement('div');
      card.className = 'blind-card';
      const quoteHtml = dest.quote.replace(/\n/g, '<br>');
      card.innerHTML = `
        <div class="blind-card-header">
          <span>SOUL CITATION #${String(index + 1).padStart(2, '0')}</span>
          <span class="blind-card-stamp">INTUITION PICK</span>
        </div>
        <div class="blind-quote-text">${quoteHtml}</div>
        <div class="blind-card-action">選擇這句箴言 ➔</div>
      `;

      card.addEventListener('click', () => {
        handleBlindPickSelection(dest);
      });

      elements.blindCardsGrid.appendChild(card);
    });

    showView('blindPick');
  }

  // 5. Handle Blind Pick -> Trigger Loading Animation -> Reveal Boarding Pass
  function handleBlindPickSelection(chosenDest) {
    state.finalDestination = chosenDest;
    audioCtrl.playClickSound();

    showView('loading');

    // Preload result image so it is 100% ready for both display and canvas export
    elements.resultTicketImg.src = chosenDest.image;

    // Typewriter carousel texts
    const statuses = [
      '正在核算靈魂疲勞指數...',
      '正在向宇宙航空申請航線...',
      '專屬單程機票列印中...'
    ];

    let step = 0;
    elements.typewriterText.textContent = statuses[0];

    const typeTimer = setInterval(() => {
      step++;
      if (step < statuses.length) {
        elements.typewriterText.textContent = statuses[step];
      } else {
        clearInterval(typeTimer);
        // Reveal result
        setTimeout(() => {
          renderResult();
          showView('result');
          audioCtrl.playStampSound();
        }, 800);
      }
    }, 900);
  }

  // 6. Render Final Result
  function renderResult() {
    const dest = state.finalDestination;
    if (!dest) return;

    elements.resultTicketImg.src = dest.image;
    elements.resultCityBadge.textContent = `${dest.name}・${dest.nameEn.toUpperCase()}`;
    
    // Two-line centered quote
    elements.resultPoeticQuote.innerHTML = dest.quote.replace(/\n/g, '<br>');
    elements.resultTagline.textContent = `${dest.tagline}`;

    // Render tags
    elements.resultTagsRow.innerHTML = '';
    dest.tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'result-tag-pill';
      span.textContent = t;
      elements.resultTagsRow.appendChild(span);
    });

    elements.metaPassenger.textContent = state.passengerName;
    elements.metaFlight.textContent = dest.flight;
    elements.metaGateSeat.textContent = `${dest.gate} / ${dest.seat}`;
  }

  // 7. Restart Test
  elements.restartBtn.addEventListener('click', () => {
    audioCtrl.playClickSound();
    state.passengerName = 'TRAVELER';
    elements.passengerInput.value = '';
    state.scores = {};
    state.userAnswers = {};
    state.finalDestination = null;
    showView('landing');
  });

  // 8. Share Link
  elements.shareBtn.addEventListener('click', () => {
    audioCtrl.playClickSound();
    if (navigator.clipboard && window.location.href) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => showToast('已複製測驗連結至剪貼簿！'))
        .catch(() => showToast('測驗網址：' + window.location.href));
    } else {
      showToast('測驗網址：' + window.location.href);
    }
  });

  // 9. Generate & Download High-Res 9:16 (1080x1920) Magazine Image
  elements.downloadBtn.addEventListener('click', () => {
    audioCtrl.playStampSound();
    generateAndDownloadTicketImage();
  });

  async function generateAndDownloadTicketImage() {
    const dest = state.finalDestination;
    if (!dest) return;

    showToast('正在生成專屬登機證圖片...');

    // Wait for custom fonts to be fully active in canvas
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const canvas = elements.exportCanvas;
    const ctx = canvas.getContext('2d');
    const W = 1080;
    const H = 1920;

    canvas.width = W;
    canvas.height = H;

    // Load ticket image reliably
    const imgElement = await loadTicketImage(dest.image);

    // Draw the full magazine canvas
    drawMagazineCanvas(ctx, W, H, dest, imgElement);

    // Trigger download
    canvas.toBlob((blob) => {
      if (!blob) {
        showToast('圖片生成失敗，請稍後再試');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BoardingPass_${dest.nameEn}_${state.passengerName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('✓ 已保存專屬逃亡機票圖片！');
    }, 'image/png');
  }

  function loadTicketImage(src) {
    return new Promise((resolve) => {
      // First check if DOM image is already loaded and ready
      if (elements.resultTicketImg && elements.resultTicketImg.complete && elements.resultTicketImg.naturalWidth > 0 && elements.resultTicketImg.src.includes(src)) {
        return resolve(elements.resultTicketImg);
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn('Fallback: image load failed for canvas', src);
        resolve(null);
      };
      img.src = src;
    });
  }

  function drawMagazineCanvas(ctx, W, H, dest, ticketImg) {
    const roundFont = '"Hiragino Maru Gothic ProN", "Hiragino Sans Rounded", "jf-openhuninn", "Nunito", sans-serif';

    // 1. Background Cream Paper Color
    ctx.fillStyle = '#F7F4EB';
    ctx.fillRect(0, 0, W, H);

    // Subtle paper noise dots
    ctx.fillStyle = 'rgba(43, 40, 37, 0.035)';
    for (let x = 0; x < W; x += 14) {
      for (let y = 0; y < H; y += 14) {
        if ((x + y) % 28 === 0) {
          ctx.fillRect(x + (Math.random() * 4), y + (Math.random() * 4), 2, 2);
        }
      }
    }

    // 2. Elegant Outer Frame
    ctx.strokeStyle = '#D4C9B8';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 40, 40, W - 80, H - 80, 24);
    ctx.stroke();

    ctx.strokeStyle = '#E5DFD3';
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, 48, 48, W - 96, H - 96, 20);
    ctx.stroke();

    // Corner decorative markers
    const corners = [[48, 48], [W - 48, 48], [48, H - 48], [W - 48, H - 48]];
    ctx.fillStyle = '#C4975A';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Magazine Header Bar
    ctx.fillStyle = '#7A7268';
    ctx.font = '700 22px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('VOL. 2027 / SPECIAL ESCAPE ISSUE', 80, 105);

    ctx.textAlign = 'right';
    ctx.fillText('ONE-WAY TICKET', W - 80, 105);

    ctx.strokeStyle = '#D4C9B8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 132);
    ctx.lineTo(W - 80, 132);
    ctx.stroke();

    // ========================================================
    // SPACIOUS & EDITORIAL VERTICAL COMPOSITION
    // ========================================================

    // 4. Main Title Section (Increased Line Spacing)
    ctx.fillStyle = '#A84D3A';
    ctx.font = `800 24px ${roundFont}`;
    ctx.textAlign = 'center';
    ctx.fillText('✦ 登機倒數・暫停生活的單程機票 ✦', W / 2, 220);

    ctx.fillStyle = '#2B2825';
    ctx.font = `900 66px ${roundFont}`;
    ctx.fillText('逃 亡 坐 標 確 認', W / 2, 310);

    // Passenger Name
    ctx.fillStyle = '#C4975A';
    ctx.font = '700 24px "Space Mono", monospace';
    ctx.fillText(`PASSENGER: ${state.passengerName}`, W / 2, 375);

    // 5. Draw Boarding Pass Ticket
    let cardY = 435;
    let cardH = 340;

    if (ticketImg && ticketImg.naturalWidth && ticketImg.naturalHeight) {
      const ticketImgW = 860;
      const imgAspect = ticketImg.naturalWidth / ticketImg.naturalHeight;
      let ticketImgH = ticketImgW / imgAspect;

      if (ticketImgH > 330) {
        ticketImgH = 330;
      }

      // Snug padding: 14px around ticket
      const cardW = ticketImgW + 28;
      cardH = ticketImgH + 28;
      const cardX = (W - cardW) / 2;

      // Card shadow & background
      ctx.save();
      ctx.shadowColor = 'rgba(60, 48, 35, 0.14)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 12;
      ctx.fillStyle = '#FFFFFF';
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 20);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = '#E5DFD3';
      ctx.lineWidth = 1.5;
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 20);
      ctx.stroke();

      // Draw ticket image inside
      const imgX = cardX + 14;
      const imgY = cardY + 14;
      ctx.save();
      drawRoundedRect(ctx, imgX, imgY, ticketImgW, ticketImgH, 14);
      ctx.clip();
      ctx.drawImage(ticketImg, imgX, imgY, ticketImgW, ticketImgH);
      ctx.restore();
    }

    // 6. City Name & Destination Hero (Increased Line Spacing)
    const heroY = cardY + cardH + 65;
    ctx.fillStyle = '#3E5948';
    ctx.font = `800 24px ${roundFont}`;
    ctx.textAlign = 'center';
    ctx.fillText(`✦ DESTINATION: ${dest.countryEn.toUpperCase()} / ${dest.country} ✦`, W / 2, heroY);

    ctx.fillStyle = '#2B2825';
    ctx.font = `900 76px ${roundFont}`;
    ctx.fillText(dest.name, W / 2, heroY + 85);

    ctx.fillStyle = '#7A7268';
    ctx.font = '700 36px "Nunito", sans-serif';
    ctx.fillText(dest.nameEn, W / 2, heroY + 145);

    // 7. Poetic Quote Box (Proportionate height + two-line centered quote)
    const quoteBoxY = heroY + 195;
    const quoteBoxW = 900;
    const quoteBoxH = 225;
    const quoteBoxX = (W - quoteBoxW) / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(60, 48, 35, 0.08)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#FFFFFF';
    drawRoundedRect(ctx, quoteBoxX, quoteBoxY, quoteBoxW, quoteBoxH, 20);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#E5DFD3';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, quoteBoxX, quoteBoxY, quoteBoxW, quoteBoxH, 20);
    ctx.stroke();

    // Decorative quotation marks “ and ”
    ctx.fillStyle = 'rgba(168, 77, 58, 0.45)';
    ctx.font = '800 68px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText('“', quoteBoxX + 35, quoteBoxY + 58);

    ctx.textAlign = 'right';
    ctx.fillText('”', quoteBoxX + quoteBoxW - 35, quoteBoxY + quoteBoxH - 30);

    // Two-line clean centered quote text with comfortable spacing
    ctx.fillStyle = '#2B2825';
    ctx.font = `800 34px ${roundFont}`;
    ctx.textAlign = 'center';

    const quoteLines = dest.quote.split('\n');
    const lineSpacing = 56;
    const totalTextHeight = quoteLines.length * lineSpacing;
    const textStartY = quoteBoxY + 65 + (quoteBoxH - 120 - totalTextHeight) / 2;

    quoteLines.forEach((line, i) => {
      ctx.fillText(line, W / 2, textStartY + (i * lineSpacing));
    });

    // Tagline below quote
    ctx.fillStyle = '#7A7268';
    ctx.font = `500 22px ${roundFont}`;
    ctx.fillText(dest.tagline, W / 2, quoteBoxY + quoteBoxH - 24);

    // 8. Flight Metadata Table Box
    const metaY = quoteBoxY + quoteBoxH + 35;
    const metaW = 900;
    const metaH = 148;
    const metaX = (W - metaW) / 2;

    ctx.fillStyle = '#F4EEE5';
    drawRoundedRect(ctx, metaX, metaY, metaW, metaH, 16);
    ctx.fill();

    ctx.strokeStyle = '#D4C9B8';
    ctx.setLineDash([6, 6]);
    drawRoundedRect(ctx, metaX, metaY, metaW, metaH, 16);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    const colW = metaW / 4;
    const labels = ['FLIGHT', 'GATE', 'SEAT', 'DATE'];
    const vals = [dest.flight, dest.gate, dest.seat, dest.date];

    labels.forEach((lbl, i) => {
      const cx = metaX + (colW * i) + (colW / 2);
      ctx.fillStyle = '#9E9486';
      ctx.font = '700 17px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(lbl, cx, metaY + 48);

      ctx.fillStyle = '#2B2825';
      ctx.font = '700 30px "Space Mono", monospace';
      ctx.fillText(vals[i], cx, metaY + 100);
    });

    // 9. Tags & Red Retro Stamp Seal
    const tagsY = metaY + metaH + 50;
    ctx.fillStyle = '#7A7268';
    ctx.font = `700 23px ${roundFont}`;
    ctx.textAlign = 'center';
    ctx.fillText(dest.tags.join('    '), W / 2, tagsY);

    ctx.save();
    ctx.translate(W - 180, metaY + metaH + 45);
    ctx.rotate((-14 * Math.PI) / 180);

    ctx.strokeStyle = '#A84D3A';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, 72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#A84D3A';
    ctx.font = '800 17px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BOARDED', 0, -24);
    ctx.font = '700 22px "Space Mono", monospace';
    ctx.fillText('2027.02.14', 0, 8);
    ctx.font = '800 17px "Space Mono", monospace';
    ctx.fillText('CERTIFIED', 0, 38);
    ctx.restore();

    // 10. Footer Branding (Perfect bottom alignment)
    ctx.fillStyle = '#9E9486';
    ctx.font = '700 22px "Space Mono", monospace';
    ctx.fillText('✦ ONE-WAY BOARDING PASS TO PAUSE LIFE ✦', W / 2, 1800);

    ctx.font = '700 18px "Space Mono", monospace';
    ctx.fillText('SHARE TO INSTAGRAM STORY  •  SCAN FOR PSYCHOLOGICAL QUIZ', W / 2, 1842);
  }

  // Distortion-free, mathematically perfect Rounded Rectangle for Canvas
  function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, width, height, radius);
    } else {
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + width, y, x + width, y + height, radius);
      ctx.arcTo(x + width, y + height, x, y + height, radius);
      ctx.arcTo(x, y + height, x, y, radius);
      ctx.arcTo(x, y + width, y, radius);
      ctx.closePath();
    }
  }
});
