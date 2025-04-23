<template>
  <div v-if="items.length > 0" class="cereal-carousel">
    <button
      @click="scrollLeft"
      class="arrow left-arrow"
      :disabled="isAtStart"
      aria-label="Scroll left"
    >
      &lt;
    </button>
    <div class="cereal-list-container" ref="carouselContent" @scroll="handleScroll">
      <ul class="cereal-list">
        <li v-for="cereal in items" :key="cereal.id" class="cereal-item">
          <img :src="baseURL + cereal.picture" :alt="cereal.name" />
          <h3>{{ cereal.name }}</h3>
          <p>By: {{ getManufacturerFullName(cereal.mfr) }}</p>
        </li>
      </ul>
    </div>
    <button
      @click="scrollRight"
      class="arrow right-arrow"
      :disabled="isAtEnd"
      aria-label="Scroll right"
    >
      &gt;
    </button>
  </div>
</template>

<script>
export default {
  name: 'CerealCarousel',
  props: {
    items: {
      type: Array,
      required: true,
    },
    baseURL: {
      type: String,
      required: true,
    },
    getManufacturerFullName: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isAtStart: true,
      isAtEnd: false,
    }
  },
  methods: {
    scrollLeft() {
      this.scroll(-1)
    },
    scrollRight() {
      this.scroll(1)
    },
    scroll(direction) {
      const container = this.$refs.carouselContent
      if (!container) return
      const scrollAmount = container.offsetWidth * 0.8
      container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' })
      setTimeout(this.checkScrollPosition, 350)
    },
    checkScrollPosition() {
      const container = this.$refs.carouselContent
      if (!container) {
        this.isAtStart = true
        this.isAtEnd = true
        return
      }
      const tolerance = 1
      this.isAtStart = container.scrollLeft <= tolerance
      this.isAtEnd =
        container.scrollLeft + container.clientWidth >= container.scrollWidth - tolerance
      if (container.scrollWidth <= container.clientWidth) {
        this.isAtStart = true
        this.isAtEnd = true
      }
    },
    handleScroll() {
      this.checkScrollPosition()
    },
  },
  mounted() {
    this.checkScrollPosition()
    window.addEventListener('resize', this.checkScrollPosition)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScrollPosition)
  },
}
</script>

<style scoped>
.cereal-carousel {
  position: relative;
  width: 100%;
  margin: 20px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cereal-list-container {
  display: flex;
  overflow-x: scroll;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  width: calc(100% - 90px);
  padding: 20px 0;
  min-height: 400px;
}

.cereal-list-container::-webkit-scrollbar {
  display: none;
}

.cereal-list {
  display: flex;
  list-style: none;
  padding: 0 15px;
  margin: 0;
  gap: 25px;
}

.cereal-item {
  flex: 0 0 300px;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  background-color: var(--card-bg, #ffffff);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cereal-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.cereal-item img {
  max-width: 100%;
  height: 200px;
  object-fit: contain;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #f0f0f0;
}

.cereal-item h3 {
  font-size: 1.4em;
  margin: 0 0 10px 0;
  color: var(--text-color, #333);
  font-weight: 600;
  line-height: 1.3;
}

.cereal-item p {
  font-size: 0.95em;
  color: var(--light-text-color, #555);
  line-height: 1.5;
  margin-top: auto;
}

.arrow {
  background-color: #fff;
  color: var(--primary-color, #4a90e2);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5em;
  font-weight: bold;
  z-index: 10;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    transform 0.2s ease,
    box-shadow 0.3s ease,
    opacity 0.3s ease;
}

.arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: translateY(-50%) scale(1);
}

.arrow:not(:disabled):hover {
  background-color: var(--primary-color, #4a90e2);
  color: #fff;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
}

.left-arrow {
  left: -25px;
}

.right-arrow {
  right: -25px;
}

@media (max-width: 768px) {
  .cereal-list-container {
    width: calc(100% - 70px);
    min-height: 380px;
  }

  .cereal-item {
    flex: 0 0 260px;
    padding: 20px;
  }

  .cereal-item img {
    height: 160px;
  }

  .arrow {
    width: 40px;
    height: 40px;
    font-size: 1.3em;
  }

  .left-arrow {
    left: -20px;
  }

  .right-arrow {
    right: -20px;
  }
}

@media (max-width: 576px) {
  .cereal-list-container {
    width: 100%;
    padding: 10px 45px;
  }

  .cereal-item {
    flex: 0 0 220px;
    padding: 15px;
  }

  .cereal-item img {
    height: 140px;
  }

  .arrow {
    width: 35px;
    height: 35px;
    font-size: 1.1em;
    background-color: rgba(255, 255, 255, 0.9);
  }

  .left-arrow {
    left: 5px;
  }

  .right-arrow {
    right: 5px;
  }
}
</style>
