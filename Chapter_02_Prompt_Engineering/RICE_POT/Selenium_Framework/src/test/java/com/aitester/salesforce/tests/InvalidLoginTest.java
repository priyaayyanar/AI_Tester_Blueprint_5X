package com.aitester.salesforce.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.aitester.salesforce.base.BaseTest;
import com.aitester.salesforce.pages.LoginPage;

import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;

@Epic("Salesforce Authentication")
@Feature("Login")
public class InvalidLoginTest extends BaseTest {

    @Test(priority = 1, description = "Invalid credentials display an authentication error and keep the user on the login page")
    @Story("Invalid credentials")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Login with invalid credentials and verify a login error is displayed while the user remains on the login page")
    public void verifyLoginWithInvalidCredentials() {
        try {
            LoginPage loginPage = new LoginPage(driver);
            loginPage.doLogin(getConfig("invalid.username"), getConfig("invalid.password"));

            Assert.assertTrue(loginPage.isErrorMessageDisplayed(), "No error message was displayed for invalid credentials");

            String message = loginPage.getErrorMessage().toLowerCase();
            Assert.assertTrue(message.contains("username") || message.contains("password"),
                    "Unexpected login error message: " + message);
            Assert.assertTrue(loginPage.getCurrentUrl().contains("login.salesforce.com"),
                    "The user should remain on the login page after invalid credentials");
        } catch (AssertionError e) {
            throw e;
        } catch (RuntimeException e) {
            throw new IllegalStateException("Invalid login verification failed: " + e.getMessage(), e);
        }
    }
}
