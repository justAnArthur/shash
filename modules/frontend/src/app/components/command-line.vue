<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { commands as _commands } from "src/app/components/command-line.commands"

const router = useRouter()

const inputValue = ref('')
const selectedSuggestionIndex = ref<number | null>(null)
const suggestions = ref<{ text: string; onEnter?: () => void }[]>([])

const commands = _commands({ router })

const onInput = () => {
  suggestions.value = []

  if (!inputValue.value.startsWith('/')) {
    return
  }

  const filteredCommand = commands.find((command) => inputValue.value.startsWith(command.slash))

  if (!filteredCommand) {
    suggestions.value = commands.map((command) => ({
      text: command.slash,
      onEnter: () => {
        inputValue.value = command.slash + ' '
        onInput()
      }
    }))
    return
  }

  const [, ...parameters] = inputValue.value.split(' ')

  filteredCommand?.suggestions?.(...parameters).then((result) => {
    suggestions.value = result
  })
}

const scrollToActiveSuggestion = () => {
  const activeItem = document.querySelector('.is-active') as HTMLElement
  if (activeItem) {
    activeItem.scrollIntoView({ block: 'center' })
  }
}

const onKeyDown = () => {
  if (suggestions.value.length === 0) return

  if (selectedSuggestionIndex.value === null) {
    selectedSuggestionIndex.value = suggestions.value.length - 1
    return
  }

  if (selectedSuggestionIndex.value === suggestions.value.length - 1) {
    selectedSuggestionIndex.value = 0
    return
  }

  selectedSuggestionIndex.value++
  scrollToActiveSuggestion()
}

const onKeyUp = () => {
  if (suggestions.value.length === 0) return

  if (selectedSuggestionIndex.value === null) {
    selectedSuggestionIndex.value = 0
    return
  }

  if (selectedSuggestionIndex.value === 0) {
    selectedSuggestionIndex.value = suggestions.value.length - 1
    return
  }

  selectedSuggestionIndex.value--
  scrollToActiveSuggestion()
}

const onKeyEnter = () => {
  if (suggestions.value.length === 0) return

  const suggestion = suggestions.value[selectedSuggestionIndex.value || 0]
  suggestion?.onEnter?.()

  selectedSuggestionIndex.value = null
  suggestions.value = []
}
</script>

<template>
  <div id="command-line-group">
    <div id="command-line-wrapper" style="display: flex">
      <input id="command-line" v-model="inputValue" @input="onInput" @keydown.down.prevent="onKeyDown"
             @keydown.up.prevent="onKeyUp" @keydown.enter.prevent="onKeyEnter" autocomplete="off" placeholder="/"/>

      <button class="q-btn" style="aspect-ratio: 1/1">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="lucide lucide-send-horizontal">
          <path
            d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/>
          <path d="M6 12h16"/>
        </svg>
      </button>
    </div>
    <div v-if="suggestions.length > 0" id="suggestions-popover">
      <ul id="suggestions-list">
        <li id="suggestions-item" v-for="(suggestion, index) in suggestions" :key="index"
            :class="{ 'is-active': index == selectedSuggestionIndex }">
          {{ suggestion.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
#command-line-group {
  position: relative;
}

#command-line-wrapper {
  position: relative;
  z-index: 20;

  width: 100%;

  padding: 1.5rem;
  border-radius: 1.5rem;

  background: var(--color-30);
}

#command-line {
  border: none;
  background: none;
  outline: none;

  color: white;

  font-size: 16px;

  width: 100%;
}

#suggestions-popover {
  z-index: 10;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50%;
  padding: 1.5rem 1rem 4rem;

  background: var(--color-10);
  border-radius: 1.5rem 1.5rem 0 0;

  overflow: hidden;
}

#suggestions-list {
  overflow-y: auto;
  max-height: 13rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

#suggestions-item {
  position: relative;
  display: flex;
  gap: 1rem;
  height: fit-content;
  padding: 12px 36px 12px 12px;
  border-radius: 15px;
  background: var(--color-20);
  transition: background-color;
  cursor: pointer;
}

#suggestions-item.is-active {
  background: var(--color-10)
}
</style>
