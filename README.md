# Negative Colors Extension

A Chrome extension that allows users to invert the colors of websites, applying a negative color scheme to improve visibility and reduce eye strain. The extension features customizable settings, including a blacklist and whitelist mode for controlling which websites the extension applies to.

## Features

- **Negative Color Scheme**: Inverts the colors of websites for a negative effect.
- **Customizable Lists**: 
  - **Blacklist Mode**: The extension applies to all websites except those on the blacklist.
  - **Whitelist Mode**: The extension applies only to websites on the whitelist.
- **Dynamic Content Handling**: Automatically applies the negative effect to dynamic content like images and video backgrounds.
- **User-Friendly Interface**: Modern and intuitive UI with easy-to-use switches for customization.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/negative-colors-extension.git
    ```
2. **Load the extension**:
    1. Open Chrome and navigate to `chrome://extensions/`.
    2. Enable "Developer mode" in the top right corner.
    3. Click "Load unpacked" and select the extension's directory.

## Usage

- **Toggling the Negative Colors**: 
  - Use the popup in the Chrome toolbar to toggle the negative colors on or off for the current website.
  - Adjust settings like the blacklist and whitelist directly from the popup.

## Development

### Prerequisites

- Basic knowledge of JavaScript, HTML, and CSS.
- Chrome browser for testing the extension.

### File Structure

- **background.js**: Handles background tasks such as storing settings and managing the extension's state.
- **content.js**: Contains the logic for applying the negative color scheme and observing changes in the DOM.
- **popup.js**: Manages the popup interface and user interactions.
- **popup.html**: The HTML structure of the popup.
- **styles.css**: Styling for the popup and other UI components.

### Contributing

1. **Fork the repository** on GitHub.
2. **Create a new branch**:
    ```bash
    git checkout -b feature/YourFeatureName
    ```
3. **Commit your changes**:
    ```bash
    git commit -m 'Add some feature'
    ```
4. **Push to the branch**:
    ```bash
    git push origin feature/YourFeatureName
    ```
5. **Open a pull request**: Describe your changes and submit it for review.

### Issues

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions, suggestions, or feedback, please contact:
- **Your Name** - [tamar.sharabi123@gmail.com](mailto:tamar.sharabi123@gmail.com)
- GitHub: [tamar-dev](https://github.com/tamar-dev)
