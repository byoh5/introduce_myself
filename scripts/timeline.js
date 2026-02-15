(function () {
  const nodes = document.querySelectorAll('.system-node');
  const title = document.querySelector('#system-panel-title');
  const copy = document.querySelector('#system-panel-copy');

  if (!nodes.length || !title || !copy) {
    return;
  }

  const contentByNode = {
    hardware: {
      title: '하드웨어 계층',
      copy: '연산 자원, 메모리 대역폭, 인터페이스 제약이 전체 실행 성능의 상한을 만듭니다.',
    },
    model: {
      title: '모델 실행 계층',
      copy: '양자화, 연산자 매핑, 런타임 스케줄링이 실제 추론 지연과 안정성을 좌우합니다.',
    },
    data: {
      title: '데이터 파이프라인',
      copy: '센서/설비 데이터의 정제, 스키마 정의, 시계열 구조화가 AI 적용 가능성을 결정합니다.',
    },
    operation: {
      title: '운영 피드백 루프',
      copy: '배포 이후 모니터링, 피드백, 버전 관리가 모델 성능을 현장에서 지속시키는 핵심 루프입니다.',
    },
  };

  const activate = function (key) {
    nodes.forEach(function (node) {
      const isActive = node.dataset.node === key;
      node.classList.toggle('active', isActive);
      node.setAttribute('aria-pressed', String(isActive));
    });

    const selected = contentByNode[key];
    if (selected) {
      title.textContent = selected.title;
      copy.textContent = selected.copy;
    }
  };

  nodes.forEach(function (node) {
    node.addEventListener('click', function () {
      activate(node.dataset.node);
    });

    node.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate(node.dataset.node);
      }
    });
  });
})();
