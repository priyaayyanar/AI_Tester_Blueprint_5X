package com.aitester.salesforce.base;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.Properties;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.chromium.ChromiumOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;

import io.qameta.allure.Step;

public class BaseTest {

    private static final String CONFIG_FILE = "config.properties";
    private static final Properties CONFIG = loadConfig();

    protected WebDriver driver;

    @BeforeTest(alwaysRun = true)
    @Step("Launch the browser and open the Salesforce login page")
    public void setUp() {
        try {
            driver = createDriver();
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
            driver.get(getConfig("base.url"));
        } catch (RuntimeException e) {
            throw new IllegalStateException("Failed to initialize the WebDriver: " + e.getMessage(), e);
        }
    }

    @AfterTest(alwaysRun = true)
    @Step("Close the browser")
    public void tearDown() {
        try {
            if (driver != null) {
                driver.quit();
            }
        } catch (RuntimeException e) {
            throw new IllegalStateException("Failed to close the WebDriver: " + e.getMessage(), e);
        } finally {
            driver = null;
        }
    }

    protected WebDriver createDriver() {
        String browser = getConfig("browser").toLowerCase();
        switch (browser) {
            case "edge":
                return createEdgeDriver();
            case "chrome":
                return createChromeDriver();
            default:
                throw new IllegalStateException("Unsupported browser: " + browser);
        }
    }

    private WebDriver createChromeDriver() {
        setDriverExecutable("webdriver.chrome.driver", "chrome.driver.path");
        ChromeOptions options = new ChromeOptions();
        applyCommonOptions(options);
        return new ChromeDriver(options);
    }

    private WebDriver createEdgeDriver() {
        setDriverExecutable("webdriver.edge.driver", "edge.driver.path");
        EdgeOptions options = new EdgeOptions();
        applyCommonOptions(options);
        return new EdgeDriver(options);
    }

    private void applyCommonOptions(ChromiumOptions<?> options) {
        options.addArguments("--disable-gpu");
        options.addArguments("--disable-notifications");
        options.addArguments("--remote-allow-origins=*");
        if (isHeadless()) {
            options.addArguments("--headless=new");
            options.addArguments("--window-size=1920,1080");
        } else {
            options.addArguments("--start-maximized");
        }
    }

    private void setDriverExecutable(String systemProperty, String configKey) {
        Path driver = Paths.get(getConfig(configKey));
        if (!driver.isAbsolute()) {
            driver = Paths.get(System.getProperty("user.dir")).resolve(driver);
        }
        if (!Files.exists(driver)) {
            throw new IllegalStateException("Driver executable not found: " + driver.toAbsolutePath());
        }
        System.setProperty(systemProperty, driver.toAbsolutePath().toString());
    }

    protected String getConfig(String key) {
        String value = CONFIG.getProperty(key);
        if (value == null) {
            throw new IllegalStateException("Missing configuration key: " + key);
        }
        return value.trim();
    }

    protected boolean isHeadless() {
        return Boolean.parseBoolean(getConfig("headless"));
    }

    private static Properties loadConfig() {
        Properties properties = new Properties();
        try (InputStream input = BaseTest.class.getClassLoader().getResourceAsStream(CONFIG_FILE)) {
            if (input == null) {
                throw new IllegalStateException(CONFIG_FILE + " could not be found on the classpath");
            }
            properties.load(input);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to load " + CONFIG_FILE, e);
        }
        return properties;
    }
}
