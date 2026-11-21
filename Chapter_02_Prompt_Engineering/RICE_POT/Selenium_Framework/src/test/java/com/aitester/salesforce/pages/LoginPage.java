package com.aitester.salesforce.pages;

import java.time.Duration;

import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.qameta.allure.Step;

public class LoginPage {

    private static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(20);

    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement usernameField;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement passwordField;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//input[@id='rememberUn']")
    private WebElement rememberMeCheckbox;

    @FindBy(xpath = "//div[@id='error']")
    private WebElement errorMessage;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, DEFAULT_TIMEOUT);
        PageFactory.initElements(driver, this);
    }

    @Step("Enter username: {0}")
    public LoginPage enterUsername(String username) {
        try {
            wait.until(ExpectedConditions.visibilityOf(usernameField)).clear();
            usernameField.sendKeys(username);
        } catch (TimeoutException | NoSuchElementException e) {
            throw new IllegalStateException("Unable to enter username on the login page", e);
        }
        return this;
    }

    @Step("Enter password")
    public LoginPage enterPassword(String password) {
        try {
            wait.until(ExpectedConditions.visibilityOf(passwordField)).clear();
            passwordField.sendKeys(password);
        } catch (TimeoutException | NoSuchElementException e) {
            throw new IllegalStateException("Unable to enter password on the login page", e);
        }
        return this;
    }

    @Step("Click the login button")
    public void clickLogin() {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(loginButton)).click();
        } catch (TimeoutException | NoSuchElementException e) {
            throw new IllegalStateException("Unable to click the login button", e);
        }
    }

    @Step("Select the Remember Me checkbox")
    public LoginPage selectRememberMe() {
        try {
            WebElement checkbox = wait.until(ExpectedConditions.elementToBeClickable(rememberMeCheckbox));
            if (!checkbox.isSelected()) {
                checkbox.click();
            }
        } catch (TimeoutException | NoSuchElementException e) {
            throw new IllegalStateException("Unable to select the Remember Me checkbox", e);
        }
        return this;
    }

    @Step("Login with username {0}")
    public void doLogin(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
    }

    @Step("Check that the login error message is displayed")
    public boolean isErrorMessageDisplayed() {
        try {
            return wait.until(ExpectedConditions.visibilityOf(errorMessage)).isDisplayed();
        } catch (TimeoutException | NoSuchElementException e) {
            return false;
        }
    }

    @Step("Read the login error message")
    public String getErrorMessage() {
        try {
            return wait.until(ExpectedConditions.visibilityOf(errorMessage)).getText().trim();
        } catch (TimeoutException | NoSuchElementException e) {
            throw new IllegalStateException("The login error message is not displayed", e);
        }
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
}
