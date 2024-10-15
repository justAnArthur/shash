<script lang="ts">
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
        }
      ]
    }
  },
  methods: {
    getChats: async (query) => {
      return new Promise((resolve) => resolve(
        [...new Array(100)]
          .map((_, index) => ({ id: index, channelName: `Channel ${index}` }))
          .filter(chat => chat.channelName.includes(query))
      ), 1000)
    },

    onInput() {
      if (!this.inputValue.startsWith('/')) {
        this.suggestions = []
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

      filteredCommand.suggestions(...parameters)
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
      this.suggestions = []
    }
  }
}
</script>

<template>
  <div id="command-line-wrapper">
    <input
      v-model="inputValue"
      @input="onInput"
      @keydown.down.prevent="onKeyDown"
      @keydown.up.prevent="onKeyUp"
      @keydown.enter.prevent="onKeyEnter"
    />
    <ul v-if="suggestions.length > 0" id="suggestions-popover">
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
</template>

<style scoped>
#command-line-wrapper {
  position: relative;
}

#suggestions-popover {
  list-style: none;
  margin: 0;
  padding: 0;

  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;

  border: 1px solid #ccc;

  max-height: 13rem;
  overflow-y: auto;
}

#suggestions-item {
  padding: 0.5rem;
  cursor: pointer;

}

#suggestions-item.is-active {
  background-color: #f0f0f0;
}
</style>
