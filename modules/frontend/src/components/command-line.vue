<script lang="ts">
// @ts-nocheck
export default {
  data() {
    return {
      inputValue: '',

      selectedSuggestionIndex: null,
      suggestions: [],

      commands: [
        {
          slash: '/chat',
          parameters: ['chatName'],
          suggestions: async (chatName) => {
            if (chatName === undefined)
              return []

            function selectChat(chat) {
              alert(`Chat ${chat.id} selected`)
            }

            return (await this.getChats(chatName))
              .map(chat => ({
                text: chat.channelName,
                onEnter: () => selectChat(chat)
              }))
          }
        },
        {
          slash: '/fckQuasar'

        }
      ]
    }
  },
  methods: {
    getChats: async (query) => {
      return new Promise((resolve) => setTimeout(() => resolve(
        [...new Array(100)]
          .map((_, index) => ({ id: index, channelName: `Channel ${index}` }))
          .filter(chat => chat.channelName.includes(query))
      ), 1000))
    },

    onInput() {
      this.suggestions = []

      if (!this.inputValue.startsWith('/')) {
        return
      }

      const filteredCommand = this.commands.find(command => this.inputValue.startsWith(command.slash))

      if (!filteredCommand) {
        this.suggestions = this.commands.map(command => ({
          text: command.slash,
          onEnter: () => {
            this.inputValue = command.slash + " "
            this.onInput()
          }
        }))
      }

      const [_, ...parameters] = this.inputValue.split(' ')

      filteredCommand?.suggestions?.(...parameters)
        .then(suggestions => this.suggestions = suggestions)
    },

    // ---

    scrollToActiveSuggestion() {
      const activeItem = this.$el.querySelector('.is-active')
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'center' })
      }
    },

    onKeyDown() {
      if (this.suggestions.length === 0)
        return

      if (this.selectedSuggestionIndex === null) {
        this.selectedSuggestionIndex = this.suggestions.length - 1
        return
      }

      if (this.selectedSuggestionIndex === this.suggestions.length - 1) {
        this.selectedSuggestionIndex = 0
        return
      }

      this.selectedSuggestionIndex++

      this.scrollToActiveSuggestion()
    },
    onKeyUp() {
      if (this.suggestions.length === 0)
        return

      if (this.selectedSuggestionIndex === null) {
        this.selectedSuggestionIndex = 0
        return
      }

      if (this.selectedSuggestionIndex === 0) {
        this.selectedSuggestionIndex = this.suggestions.length - 1
        return
      }

      this.selectedSuggestionIndex--

      this.scrollToActiveSuggestion()
    },
    onKeyEnter() {
      if (this.suggestions.length === 0)
        return

      const suggestion = this.suggestions[this.selectedSuggestionIndex || 0]
      suggestion?.onEnter?.()

      this.selectedSuggestionIndex = null
      this.suggestions = []
    }
  }
}
</script>

<template>
  <div id="command-line-group">
    <div id="command-line-wrapper" style="display: flex">
      <input
        id="command-line"
        v-model="inputValue"
        @input="onInput"
        @keydown.down.prevent="onKeyDown"
        @keydown.up.prevent="onKeyUp"
        @keydown.enter.prevent="onKeyEnter"
        autocomplete="off"
        placeholder="/"
      />

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
        <li
          id="suggestions-item"
          v-for="(suggestion, index) in suggestions"
          :key="index"
          :class="{ 'is-active': index == selectedSuggestionIndex }"
        >
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

  background: #2b2b2b;
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

  background: #2e2e2e;
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
  background: hsla(0, 0%, 97%, .02);
  transition: background-color;
  cursor: pointer;
}

#suggestions-item.is-active {
  background: hsla(0, 0%, 97%, .05);
}
</style>
